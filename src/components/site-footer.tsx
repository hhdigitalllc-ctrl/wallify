import Link from "next/link";
import { Logo } from "@/components/logo";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.footer;
  const cols = [
    {
      title: t.product,
      links: [
        { path: "/features", label: d.nav.features },
        { path: "/pricing", label: d.nav.pricing },
        { path: "/compare", label: d.nav.compare },
        { path: "/faq", label: d.nav.faq },
      ],
    },
    {
      title: t.account,
      links: [
        { path: "/signup", label: d.nav.getStarted },
        { path: "/login", label: d.nav.login },
      ],
    },
    {
      title: t.legal,
      links: [
        { path: "/terms", label: t.terms },
        { path: "/privacy", label: t.privacy },
        { path: "/refunds", label: t.refunds },
      ],
    },
    {
      title: t.company,
      links: [{ path: "/brand", label: t.brandBook }],
    },
  ];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo href={href(locale, "/")} />
          <p className="mt-4 max-w-xs text-sm text-muted">{t.tagline}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.path}>
                  <Link href={href(locale, l.path)} className="text-foreground/80 transition hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs text-muted">
          <span>© {new Date().getFullYear()} Wallify</span>
          <span>{t.note}</span>
        </div>
      </div>
    </footer>
  );
}
