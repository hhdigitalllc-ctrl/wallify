"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitState = { error?: string; done?: boolean } | undefined;

export async function submitTestimonial(
  _: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) return { done: true };

  const spaceId = String(formData.get("space_id") ?? "");
  const rating = Number(formData.get("rating"));
  const content = String(formData.get("content") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  const clientTitle = String(formData.get("client_title") ?? "").trim();

  if (!spaceId) return { error: "Something went wrong, reload the page." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Pick a star rating." };
  }
  if (!content || content.length > 1000) {
    return { error: "Write your testimonial (1000 characters max)." };
  }
  if (!clientName || clientName.length > 80) {
    return { error: "Tell us your name." };
  }
  if (clientTitle.length > 80) return { error: "Title is too long." };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    space_id: spaceId,
    rating,
    content,
    client_name: clientName,
    client_title: clientTitle || null,
  });

  if (error) return { error: "Could not submit, please try again." };
  return { done: true };
}
