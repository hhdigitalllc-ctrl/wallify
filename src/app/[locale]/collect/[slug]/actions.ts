"use server";

import { createClient } from "@/lib/supabase/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export type SubmitState = { error?: string; done?: boolean } | undefined;

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

  if (!spaceId) return { error: t.errReload };
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

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    space_id: spaceId,
    rating,
    content,
    client_name: clientName,
    client_title: clientTitle || null,
  });

  if (error) return { error: t.errSubmit };
  return { done: true };
}
