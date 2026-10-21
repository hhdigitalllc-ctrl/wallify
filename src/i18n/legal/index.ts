import type { Locale } from "../config";
import { legalAr } from "./ar";
import { legalEn } from "./en";
import { legalFr } from "./fr";
import type { LegalSet } from "./types";

const sets: Record<Locale, LegalSet> = { en: legalEn, fr: legalFr, ar: legalAr };

export function getLegal(locale: Locale): LegalSet {
  return sets[locale];
}

export type LegalKind = "terms" | "privacy" | "refunds";
export { LEGAL_EMAIL } from "./types";
