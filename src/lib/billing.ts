export const PRO_PRICE_USD = 12;
export const LIFETIME_PRICE_USD = 49;

export const FREE_LIMITS = {
  spaces: 1,
  approvedTestimonials: 20,
} as const;

export type Plan = "free" | "pro" | "lifetime";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function billingEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function asPlan(value: unknown): Plan {
  return value === "lifetime" || value === "pro" ? value : "free";
}
