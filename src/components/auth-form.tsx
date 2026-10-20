"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/app/auth/actions";
import { Logo } from "@/components/logo";

type Props = {
  mode: "login" | "signup";
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
};

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const isLogin = mode === "login";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-200px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />
      <div className="relative mb-8">
        <Logo />
      </div>

      <form action={formAction} className="card relative w-full max-w-sm space-y-4 p-7">
        <div>
          <h1 className="display text-3xl">{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted">
            {isLogin ? "Log in to manage your testimonials." : "Start collecting social proof in minutes."}
          </p>
        </div>

        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder={isLogin ? "Password" : "Password (8+ characters)"}
          autoComplete={isLogin ? "current-password" : "new-password"}
          minLength={isLogin ? undefined : 8}
          required
          className="input"
        />

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        {state?.message && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">{state.message}</p>
        )}

        <button disabled={pending} className="btn-primary w-full">
          {pending ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
        </button>

        <p className="text-center text-sm text-muted">
          {isLogin ? "No account yet? " : "Already have an account? "}
          <Link href={isLogin ? "/signup" : "/login"} className="font-medium text-accent-ink hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </form>
    </main>
  );
}
