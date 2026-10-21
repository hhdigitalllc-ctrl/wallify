import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).featuresPage;
  return { title: t.title, description: t.description };
}

export default async function FeaturesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).featuresPage;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-24">
      <h1 className="display text-center text-5xl sm:text-6xl">
        {t.h1a} <span className="fade">{t.h1b}</span>
      </h1>
      <p className="mx-auto mb-14 mt-4 max-w-xl text-center text-lg text-muted">{t.sub}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.live.map((f) => (
          <div key={f.h} className="card p-6">
            <h2 className="font-semibold tracking-tight">{f.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.p}</p>
          </div>
        ))}
      </div>

      <h2 className="display mb-6 mt-20 text-3xl sm:text-4xl">
        {t.nextA} <span className="fade">{t.nextB}</span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {t.soon.map((f) => (
          <div key={f.h} className="rounded-2xl border border-dashed border-line p-6">
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-muted">
              {t.soonBadge}
            </span>
            <h3 className="mt-3 font-semibold tracking-tight">{f.h}</h3>
            <p className="mt-1.5 text-sm text-muted">{f.p}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link href={href(locale, "/signup")} className="btn btn-primary px-7 py-3.5 text-base">
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
