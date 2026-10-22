"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/logo";
import { SubmitButton } from "@/components/submit-button";
import { DashLocaleSwitcher } from "@/components/dash-locale-switcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Plan } from "@/lib/billing";

type Space = { id: string; name: string };
type Nav = Dictionary["dash"]["nav"];
type SidebarProps = { spaces: Space[]; plan: Plan; email: string; locale: Locale; t: Nav };

const icon = "h-4 w-4 shrink-0";

function GridIcon() {
  return (
    <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 10h19" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function NavContent({ spaces, plan, email, locale, t }: SidebarProps) {
  const pathname = usePathname();

  const item = (active: boolean) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
      active ? "bg-surface-2 font-medium text-foreground" : "text-muted hover:bg-surface-2/70 hover:text-foreground"
    }`;

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-5">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3" aria-label={t.dashboard}>
        <ul className="space-y-0.5">
          <li>
            <Link href="/dashboard" className={item(pathname === "/dashboard")}>
              <GridIcon /> {t.overview}
            </Link>
          </li>
          <li>
            <Link href="/dashboard/billing" className={item(pathname.startsWith("/dashboard/billing"))}>
              <CardIcon /> {t.billing}
            </Link>
          </li>
        </ul>

        <div>
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-muted">{t.spaces}</p>
          <ul className="space-y-0.5">
            {spaces.map((s) => (
              <li key={s.id}>
                <Link href={`/dashboard/space/${s.id}`} className={item(pathname.startsWith(`/dashboard/space/${s.id}`))}>
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-foreground text-[9px] font-bold text-background">
                    {s.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{s.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/dashboard#new" className={item(false)}>
                <PlusIcon /> {t.newSpace}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center justify-between gap-2 px-2 pb-3">
          <p className="min-w-0 truncate text-xs text-muted" title={email}>
            {email}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              plan !== "free" ? "bg-foreground text-background" : "bg-surface-2 text-muted"
            }`}
          >
            {plan === "lifetime" ? "Lifetime" : plan === "pro" ? "Pro" : "Free"}
          </span>
        </div>
        <div className="px-2 pb-3">
          <DashLocaleSwitcher locale={locale} label={t.language} />
        </div>
        <form action={signOut}>
          <SubmitButton className="btn-ghost btn-sm w-full">{t.logout}</SubmitButton>
        </form>
      </div>
    </div>
  );
}

export function AppSidebar(props: SidebarProps) {
  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 border-e border-line bg-surface md:block">
        <NavContent {...props} />
      </aside>

      {/* Mobile: top bar with a drop-down menu */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <Logo href="/dashboard" />
        <details className="group relative">
          <summary
            aria-label={props.t.menu}
            className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-line bg-surface [&::-webkit-details-marker]:hidden"
          >
            <span className="block h-0.5 w-4 bg-foreground shadow-[0_-5px_0_var(--foreground),0_5px_0_var(--foreground)]" />
          </summary>
          <div className="absolute end-0 mt-2 h-[min(32rem,80vh)] w-64 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
            <NavContent {...props} />
          </div>
        </details>
      </header>
    </>
  );
}
