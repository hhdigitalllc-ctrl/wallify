"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/server";

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
  const t = getDictionary(await getLocale()).dash.create;
  const name = String(formData.get("name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim() || t.defaultHeadline;
  const slug = slugify(String(formData.get("slug") ?? "") || name);

  if (!name || name.length > 80) return { error: t.errName };
  if (!slug) return { error: t.errSlug };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.errSignedOut };

  const { error } = await supabase
    .from("spaces")
    .insert({ user_id: user.id, name, slug, headline });

  if (error) {
    if (error.message.includes("free_plan_space_limit")) {
      return { error: t.errFreeLimit };
    }
    return { error: error.code === "23505" ? t.errSlugTaken(slug) : t.errGeneric };
  }

  revalidatePath("/dashboard");
}
