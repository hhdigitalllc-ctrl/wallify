import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareTable } from "@/components/compare-table";
import { Faq } from "@/components/faq";
import { HeroMock } from "@/components/hero-mock";
import { Plans } from "@/components/plans";
import { href, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: href(locale, "/"),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, "/")])),
    },
  };
}

// Re-render every few minutes so the launch-spots counter stays fresh
export const revalidate = 300;

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const t = d.home;

  return (
    <main className="mx-auto max-w-6xl px-5">
      <section className="mx-auto max-w-3xl pb-14 pt-14 text-center sm:pt-20">
        <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-muted">
          <span className="text-star">★★★★★</span> {t.badge}
        </p>
        <h1 className="display text-[44px] sm:text-7xl">
          {t.h1a} <span className="fade">{t.h1b}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">{t.sub}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href={href(locale, "/signup")} className="btn btn-primary px-7 py-3.5 text-base">
            {t.ctaPrimary}
          </Link>
          <Link href={href(locale, "/features")} className="btn btn-ghost px-7 py-3.5 text-base">
            {t.ctaSecondary}
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted">{t.note}</p>
      </section>

      <section className="pb-24">
        <HeroMock aria={d.mock.aria} caption={d.mock.caption} />
      </section>

      <section id="how" className="pb-24">
        <h2 className="display mb-10 text-4xl sm:text-5xl">
          {t.stepsA} <span className="fade">{t.stepsB}</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.steps.map((s, i) => (
            <div key={s.h} className="card p-7">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-between rounded-3xl bg-foreground p-9 text-background">
            <div>
              <h2 className="display text-4xl sm:text-5xl">
                {t.proofA} <span className="text-white/45">{t.proofB}</span>
              </h2>
              <p className="mt-5 max-w-sm text-white/65">{t.proofP}</p>
            </div>
            <div className="mt-10 h-24 rounded-xl border border-white/10 [background-image:repeating-linear-gradient(135deg,transparent_0_3px,rgba(255,255,255,0.22)_3px_4px)]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.features.map((f) => (
              <div key={f.h} className="card p-6">
                <h3 className="font-semibold tracking-tight">{f.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.p}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 text-center text-sm">
          <Link href={href(locale, "/features")} className="underline underline-offset-4">
            {t.exploreAll}
          </Link>
        </p>
      </section>

      <section className="pb-24">
        <h2 className="display mb-3 text-center text-4xl sm:text-5xl">
          {t.compareA} <span className="fade">{t.compareB}</span>
        </h2>
        <p className="mb-10 text-center text-muted">{t.compareSub}</p>
        <CompareTable t={d.compareTable} />
      </section>

      <section id="pricing" className="pb-24">
        <h2 className="display text-center text-4xl sm:text-5xl">
          {t.pricingA} <span className="fade">{t.pricingB}</span>
        </h2>
        <p className="mb-10 mt-3 text-center text-muted">{t.pricingSub}</p>
        <Plans locale={locale} />
      </section>

      <section className="pb-24">
        <h2 className="display mb-8 text-center text-4xl sm:text-5xl">
          {t.faqA} <span className="fade">{t.faqB}</span>
        </h2>
        <Faq items={d.faq.slice(0, 5)} />
        <p className="mt-6 text-center text-sm">
          <Link href={href(locale, "/faq")} className="underline underline-offset-4">
            {t.faqMore}
          </Link>
        </p>
      </section>

      <section className="pb-24">
        <div className="rounded-3xl bg-surface-2 px-6 py-16 text-center">
          <h2 className="display text-4xl sm:text-5xl">
            {t.ctaA} <span className="fade">{t.ctaB}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">{t.ctaP}</p>
          <Link href={href(locale, "/signup")} className="btn btn-primary mt-8 px-7 py-3.5 text-base">
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
