import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import { Plans } from "@/components/plans";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).pricingPage;
  return { title: t.title, description: t.description };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const t = d.pricingPage;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-24">
      <h1 className="display text-center text-5xl sm:text-6xl">
        {t.h1a} <span className="fade">{t.h1b}</span>
      </h1>
      <p className="mb-12 mt-4 text-center text-lg text-muted">{t.sub}</p>
      <Plans locale={locale} />

      <h2 className="display mb-8 mt-24 text-center text-3xl sm:text-4xl">
        {t.faqA} <span className="fade">{t.faqB}</span>
      </h2>
      <Faq items={d.faq} />
    </main>
  );
}
