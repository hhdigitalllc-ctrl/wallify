"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateSpaceState = { error?: string } | undefined;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createSpace(
  _: CreateSpaceState,
  formData: FormData,
): Promise<CreateSpaceState> {
  const name = String(formData.get("name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim() || "Send us some love!";
  const slug = slugify(String(formData.get("slug") ?? "") || name);

  if (!name || name.length > 80) return { error: "Give your space a name (80 characters max)." };
  if (!slug) return { error: "Slug needs at least one letter or number." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are signed out." };

  const { error } = await supabase
    .from("spaces")
    .insert({ user_id: user.id, name, slug, headline });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? `The slug "${slug}" is taken, try another.`
          : error.message,
    };
  }

  revalidatePath("/dashboard");
}
