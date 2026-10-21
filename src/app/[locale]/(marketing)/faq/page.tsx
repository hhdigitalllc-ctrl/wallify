import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/faq";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).faqPage;
  return { title: t.title, description: t.description };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const t = d.faqPage;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-24">
      <h1 className="display text-center text-5xl sm:text-6xl">
        {t.h1a} <span className="fade">{t.h1b}</span>
      </h1>
      <p className="mb-12 mt-4 text-center text-lg text-muted">{t.sub}</p>
      <Faq items={d.faq} />
      <div className="mt-16 text-center">
        <p className="text-muted">{t.ready}</p>
        <Link href={href(locale, "/signup")} className="btn btn-primary mt-4 px-7 py-3.5 text-base">
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
