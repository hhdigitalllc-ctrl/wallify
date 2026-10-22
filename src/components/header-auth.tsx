"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

// Supabase keeps the session in a readable "sb-…-auth-token" cookie, so the static marketing
// pages can tell a signed-in visitor apart without a request or a dynamic render.
const SESSION_COOKIE = /(?:^|;\s*)sb-[^=]*-auth-token/;

const subscribe = () => () => {};
const getSnapshot = () => SESSION_COOKIE.test(document.cookie);
const getServerSnapshot = () => false;

export function useSignedIn() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

type Labels = { login: string; getStarted: string; dashboard: string };

export function HeaderAuth({
  labels,
  loginHref,
  signupHref,
  variant,
}: {
  labels: Labels;
  loginHref: string;
  signupHref: string;
  variant: "bar" | "menu";
}) {
  const signedIn = useSignedIn();

  if (variant === "menu") {
    const item = "block rounded-lg px-3 py-2 text-sm hover:bg-surface-2";
    return signedIn ? (
      <Link href="/dashboard" className={`${item} font-semibold`}>
        {labels.dashboard}
      </Link>
    ) : (
      <>
        <Link href={loginHref} className={item}>
          {labels.login}
        </Link>
        <Link href={signupHref} className={`${item} font-semibold`}>
          {labels.getStarted}
        </Link>
      </>
    );
  }

  return signedIn ? (
    <Link href="/dashboard" className="btn btn-primary btn-sm hidden sm:inline-flex">
      {labels.dashboard}
    </Link>
  ) : (
    <>
      <Link href={loginHref} className="btn btn-ghost btn-sm hidden sm:inline-flex">
        {labels.login}
      </Link>
      <Link href={signupHref} className="btn btn-primary btn-sm hidden sm:inline-flex">
        {labels.getStarted}
      </Link>
    </>
  );
}
