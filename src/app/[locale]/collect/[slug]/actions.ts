"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { VOICE_BUCKET, detectAudioFormat, removeAudio } from "@/lib/audio";
import { VOICE_MAX_BYTES, VOICE_MAX_SECONDS } from "@/lib/voice";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export type SubmitState = { error?: string; done?: boolean } | undefined;

// Per visitor (hashed IP): at most 5 submissions per 10 minutes and 30 per day, across all spaces.
const LIMIT_SHORT = 5;
const LIMIT_DAY = 30;
const MINUTE = 60_000;

// One-way key for the visitor. The raw IP is never stored.
async function visitorKey() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-only").update(ip).digest("hex");
}

export async function submitTestimonial(
  _: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) return { done: true };

  const localeValue = String(formData.get("locale") ?? "");
  const t = getDictionary(isLocale(localeValue) ? localeValue : defaultLocale).collect;
  const spaceId = String(formData.get("space_id") ?? "");
  const rating = Number(formData.get("rating"));
  const content = String(formData.get("content") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  const clientTitle = String(formData.get("client_title") ?? "").trim();

  if (!/^[0-9a-f-]{36}$/i.test(spaceId)) return { error: t.errReload };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: t.errRating };
  }
  const audio = formData.get("audio");
  const audioFile = audio instanceof File && audio.size > 0 ? audio : null;
  const audioSeconds = Number(formData.get("audio_seconds"));
  if (audioFile && (audioFile.size > VOICE_MAX_BYTES || !Number.isInteger(audioSeconds) || audioSeconds < 1 || audioSeconds > VOICE_MAX_SECONDS + 1)) {
    return { error: t.errAudio };
  }
  // A voice recording can stand in for the written words
  if ((!content && !audioFile) || content.length > 1000) {
    return { error: t.errContent };
  }
  if (!clientName || clientName.length > 80) {
    return { error: t.errName };
  }
  if (clientTitle.length > 80) return { error: t.errTitle };

  // Inserts go through the server only: the public API can no longer write testimonials.
  const admin = createAdminClient();
  const key = await visitorKey();
  const since = (ms: number) => new Date(Date.now() - ms).toISOString();

  const countSince = (ms: number) =>
    admin
      .from("submission_log")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", key)
      .gte("created_at", since(ms));

  const [{ count: recent }, { count: day }] = await Promise.all([countSince(10 * MINUTE), countSince(24 * 60 * MINUTE)]);
  if ((recent ?? 0) >= LIMIT_SHORT || (day ?? 0) >= LIMIT_DAY) return { error: t.errRate };

  // Log the attempt first so failed or rejected attempts count too, and keep the table small
  await admin.from("submission_log").insert({ ip_hash: key, space_id: spaceId });
  await admin.from("submission_log").delete().lt("created_at", since(2 * 24 * 60 * MINUTE));

  // Store the recording first; it is removed again if the testimonial can't be saved
  let audioPath: string | null = null;
  if (audioFile) {
    const bytes = new Uint8Array(await audioFile.arrayBuffer());
    const format = detectAudioFormat(bytes);
    if (!format) return { error: t.errAudio };
    audioPath = `${spaceId}/${randomUUID()}.${format.ext}`;
    const { error: uploadError } = await admin.storage
      .from(VOICE_BUCKET)
      .upload(audioPath, bytes, { contentType: format.type, upsert: false });
    if (uploadError) return { error: t.errAudio };
  }

  const { error } = await admin.from("testimonials").insert({
    space_id: spaceId,
    rating,
    content,
    client_name: clientName,
    client_title: clientTitle || null,
    audio_path: audioPath,
    audio_seconds: audioPath ? Math.min(audioSeconds, VOICE_MAX_SECONDS) : null,
  });

  if (error) {
    await removeAudio([audioPath]);
    return { error: t.errSubmit };
  }
  return { done: true };
}
