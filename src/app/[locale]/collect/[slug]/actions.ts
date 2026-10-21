"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
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
  if (!content || content.length > 1000) {
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

  const { error } = await admin.from("testimonials").insert({
    space_id: spaceId,
    rating,
    content,
    client_name: clientName,
    client_title: clientTitle || null,
  });

  if (error) return { error: t.errSubmit };
  return { done: true };
}
