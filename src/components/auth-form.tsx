"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = {
  mode: "login" | "signup";
  locale: Locale;
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
};

export function AuthForm({ mode, locale, action }: Props) {
  const d = getDictionary(locale);
  const t = d.auth;
  const f = d.footer;
  const [state, formAction, pending] = useActionState(action, undefined);
  const isLogin = mode === "login";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="relative mb-8">
        <Logo href={href(locale, "/")} />
      </div>

      <form action={formAction} className="card relative w-full max-w-sm space-y-4 p-7">
        <input type="hidden" name="locale" value={locale} />
        <div>
          <h1 className="display text-3xl">{isLogin ? t.welcome : t.create}</h1>
          <p className="mt-1 text-sm text-muted">
            {isLogin ? t.loginSub : t.signupSub}
          </p>
        </div>

        <input
          name="email"
          type="email"
          placeholder={t.email}
          autoComplete="email"
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder={isLogin ? t.password : t.passwordNew}
          autoComplete={isLogin ? "current-password" : "new-password"}
          minLength={isLogin ? undefined : 8}
          required
          className="input"
        />

        {state?.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
        )}
        {state?.message && (
          <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{state.message}</p>
        )}

        <button disabled={pending} className="btn-primary w-full">
          {pending ? t.wait : isLogin ? t.login : t.signup}
        </button>

        {!isLogin && (
          <p className="text-center text-xs leading-relaxed text-muted">
            {t.agreeStart}{" "}
            <Link href={href(locale, "/terms")} className="underline underline-offset-2">
              {f.terms}
            </Link>{" "}
            {t.agreeAnd}{" "}
            <Link href={href(locale, "/privacy")} className="underline underline-offset-2">
              {f.privacy}
            </Link>
            .
          </p>
        )}

        <p className="text-center text-sm text-muted">
          {isLogin ? t.noAccount : t.haveAccount}{" "}
          <Link href={href(locale, isLogin ? "/signup" : "/login")} className="font-medium underline underline-offset-2">
            {isLogin ? t.signup : t.login}
          </Link>
        </p>
      </form>
    </main>
  );
}
