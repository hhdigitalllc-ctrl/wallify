export type LegalSection = { h: string; p: string[] };

export type LegalDoc = {
  title: string;
  description: string;
  updated: string;
  lede: string;
  sections: LegalSection[];
};

export type LegalSet = {
  kicker: string;
  updatedLabel: string;
  questions: string;
  terms: LegalDoc;
  privacy: LegalDoc;
  refunds: LegalDoc;
};

export const LEGAL_EMAIL = "contact@hhdigitalllc.us";
