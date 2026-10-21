import { notFound } from "next/navigation";
import { dirOf, isLocale, locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div lang={locale} dir={dirOf(locale)} className={`flex min-h-screen flex-col ${locale === "ar" ? "font-arabic" : ""}`}>
      {children}
    </div>
  );
}
