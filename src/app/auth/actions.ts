"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { href, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/server";

export type AuthState = { error?: string; message?: string } | undefined;

async function readLocale(formData: FormData) {
  const value = String(formData.get("locale") ?? "");
  const locale = isLocale(value) ? value : defaultLocale;
  // The dashboard follows the language the visitor signed in with
  (await cookies()).set(LOCALE_COOKIE, locale, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
  return getDictionary(locale);
}

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  const d = await readLocale(formData);
  const t = d.auth;
  if (!email || !password) return { error: t.errRequired };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.code === "invalid_credentials" ? d.dash.errLoginInvalid : error.message };

  redirect("/dashboard");
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  const t = (await readLocale(formData)).auth;
  if (!email || password.length < 8) {
    return { error: t.errPassword };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });
  if (error) return { error: error.message };

  // With email confirmation on, there is no session yet.
  if (!data.session) {
    return { message: t.checkInbox };
  }
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect(href(locale, "/login"));
}
