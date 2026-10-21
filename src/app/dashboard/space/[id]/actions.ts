"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// RLS limits both writes to testimonials in the signed-in user's own spaces.
export async function setApproved(formData: FormData) {
  const id = String(formData.get("id"));
  const approved = formData.get("approved") === "true";
  const supabase = await createClient();
  const spaceId = String(formData.get("space_id"));
  const safeSpaceId = /^[0-9a-f-]{36}$/i.test(spaceId) ? spaceId : "";
  const { error } = await supabase.from("testimonials").update({ approved }).eq("id", id);
  if (error?.message.includes("free_plan_testimonial_limit")) {
    redirect(safeSpaceId ? `/dashboard/space/${safeSpaceId}?limit=1` : "/dashboard");
  }
  revalidatePath("/dashboard/space/[id]", "page");
}

// Clears a flood in one click. RLS limits this to the signed-in owner's own space.
export async function deleteAllPending(formData: FormData) {
  const spaceId = String(formData.get("space_id"));
  if (!/^[0-9a-f-]{36}$/i.test(spaceId)) return;
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("space_id", spaceId).eq("approved", false);
  revalidatePath("/dashboard/space/[id]", "page");
}

export async function deleteTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/dashboard/space/[id]", "page");
}
