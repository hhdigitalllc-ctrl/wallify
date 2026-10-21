import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompareTable } from "@/components/compare-table";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).comparePage;
  return { title: t.title, description: t.description };
}

export default async function ComparePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const t = d.comparePage;

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-16 sm:pt-24">
      <h1 className="display text-center text-5xl sm:text-6xl">
        {t.h1a} <span className="fade">{t.h1b}</span>
      </h1>
      <p className="mx-auto mb-12 mt-4 max-w-xl text-center text-lg text-muted">{t.sub}</p>
      <CompareTable t={d.compareTable} />
      <div className="mt-16 rounded-3xl bg-surface-2 px-6 py-14 text-center">
        <h2 className="display text-3xl sm:text-4xl">
          {t.ctaA} <span className="fade">{t.ctaB}</span>
        </h2>
        <Link href={href(locale, "/signup")} className="btn btn-primary mt-7 px-7 py-3.5 text-base">
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
