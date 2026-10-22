"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { LIFETIME_PRICE_USD, PRO_PRICE_USD, siteUrl } from "@/lib/billing";

// Stripe Managed Payments requires a product tax code: SaaS, business use
const TAX_CODE = "txcd_10103001";

export async function startCheckout(formData: FormData) {
  const plan = formData.get("plan") === "lifetime" ? "lifetime" : "pro";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Never sell a second plan to someone who already has one
  const { data: current } = await supabase.rpc("my_plan");
  if (current && current !== "free") redirect("/dashboard/billing");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const common = {
    client_reference_id: user.id,
    allow_promotion_codes: true,
    success_url: `${siteUrl}/dashboard/billing?upgraded=1`,
    cancel_url: `${siteUrl}/dashboard/billing`,
    ...(sub?.stripe_customer_id
      ? { customer: sub.stripe_customer_id }
      : { customer_email: user.email }),
  };

  const session =
    plan === "lifetime"
      ? await stripe().checkout.sessions.create({
          ...common,
          mode: "payment",
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: LIFETIME_PRICE_USD * 100,
                product_data: { name: "Wallify Lifetime", tax_code: TAX_CODE },
              },
            },
          ],
          metadata: { user_id: user.id, plan: "lifetime" },
          payment_intent_data: { metadata: { user_id: user.id, plan: "lifetime" } },
        })
      : await stripe().checkout.sessions.create({
          ...common,
          mode: "subscription",
          line_items: [
            process.env.STRIPE_PRICE_ID
              ? { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
              : {
                  quantity: 1,
                  price_data: {
                    currency: "usd",
                    unit_amount: PRO_PRICE_USD * 100,
                    recurring: { interval: "month" },
                    product_data: { name: "Wallify Pro", tax_code: TAX_CODE },
                  },
                },
          ],
          subscription_data: { metadata: { user_id: user.id } },
        });

  redirect(session.url!);
}

export async function openPortal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!sub?.stripe_customer_id) redirect("/dashboard/billing");

  let url: string | null = null;
  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${siteUrl}/dashboard/billing`,
    });
    url = session.url;
  } catch (err) {
    console.error("billing portal failed", err);
  }

  redirect(url ?? "/dashboard/billing?portal=error");
}
