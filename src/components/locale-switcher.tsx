"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, href, localeNames, locales, stripLocale, type Locale } from "@/i18n/config";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const path = stripLocale(pathname);

  return (
    <div className="flex items-center rounded-lg border border-line bg-surface p-0.5 text-xs" dir="ltr">
      {locales.map((l) => (
        <Link
          key={l}
          href={href(l, path)}
          hrefLang={l}
          lang={l}
          onClick={() => {
            document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
          }}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-md px-2 py-1 font-medium transition ${
            l === locale ? "bg-foreground text-background" : "text-muted hover:text-foreground"
          }`}
        >
          {l === "ar" ? localeNames.ar : l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
