export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

// English lives at the root (/features), other locales are prefixed (/fr/features).
export function href(locale: Locale, path: string) {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

// Strip a leading locale segment: "/fr/features" -> "/features"
export function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split("/");
  if (first && isLocale(first)) return "/" + rest.join("/");
  return pathname || "/";
}

// The dashboard has no locale segment in its URL, so it follows this cookie.
export const LOCALE_COOKIE = "locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
