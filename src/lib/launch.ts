import { createAdminClient } from "@/lib/supabase/admin";
import { LAUNCH_SPOTS, LIFETIME_LAUNCH_PRICE_USD, LIFETIME_PRICE_USD } from "@/lib/billing";

// How many Lifetime licences have been sold. Drives the limited launch price,
// both on the pricing page and at checkout, so the two always agree.
export async function getLifetimeSold(): Promise<number> {
  try {
    const { count, error } = await createAdminClient()
      .from("subscriptions")
      .select("user_id", { count: "exact", head: true })
      .eq("lifetime", true);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export function lifetimeOffer(sold: number) {
  const left = Math.max(0, LAUNCH_SPOTS - sold);
  return {
    launch: left > 0,
    left,
    price: left > 0 ? LIFETIME_LAUNCH_PRICE_USD : LIFETIME_PRICE_USD,
  };
}
