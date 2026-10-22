"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isLocale } from "@/i18n/config";

export async function setLocale(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  if (!isLocale(value)) return;
  (await cookies()).set(LOCALE_COOKIE, value, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
  revalidatePath("/dashboard", "layout");
}
