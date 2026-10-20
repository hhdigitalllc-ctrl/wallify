"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// RLS limits both writes to testimonials in the signed-in user's own spaces.
export async function setApproved(formData: FormData) {
  const id = String(formData.get("id"));
  const approved = formData.get("approved") === "true";
  const supabase = await createClient();
  await supabase.from("testimonials").update({ approved }).eq("id", id);
  revalidatePath("/dashboard/space/[id]", "page");
}

export async function deleteTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/dashboard/space/[id]", "page");
}
