export const PRO_PRICE_USD = 9;
// Lifetime: a limited launch price for the first customers, then the regular price
export const LIFETIME_LAUNCH_PRICE_USD = 39;
export const LIFETIME_PRICE_USD = 69;
export const LAUNCH_SPOTS = 50;

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
