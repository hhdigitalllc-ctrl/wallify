import Link from "next/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/logo";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).nav;
  const nav = [
    { path: "/features", label: t.features },
    { path: "/pricing", label: t.pricing },
    { path: "/compare", label: t.compare },
    { path: "/faq", label: t.faq },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5">
        <Logo href={href(locale, "/")} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.path}
              href={href(locale, n.path)}
              className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-surface-2 hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <Link href={href(locale, "/login")} className="btn btn-ghost btn-sm hidden sm:inline-flex">
            {t.login}
          </Link>
          <Link href={href(locale, "/signup")} className="btn btn-primary btn-sm hidden sm:inline-flex">
            {t.getStarted}
          </Link>

          {/* Mobile menu: native <details>, no JS needed */}
          <details className="group relative md:hidden">
            <summary
              aria-label={t.menu}
              className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg border border-line bg-surface [&::-webkit-details-marker]:hidden"
            >
              <span className="block h-0.5 w-4 bg-foreground shadow-[0_-5px_0_var(--foreground),0_5px_0_var(--foreground)]" />
            </summary>
            <div className="absolute end-0 mt-2 w-52 rounded-2xl border border-line bg-surface p-2 shadow-lg">
              {nav.map((n) => (
                <Link key={n.path} href={href(locale, n.path)} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                  {n.label}
                </Link>
              ))}
              <Link href={href(locale, "/login")} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                {t.login}
              </Link>
              <Link href={href(locale, "/signup")} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-surface-2">
                {t.getStarted}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
