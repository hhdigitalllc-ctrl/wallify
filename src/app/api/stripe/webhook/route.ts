import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function saveSubscription(sub: Stripe.Subscription, userIdHint?: string | null) {
  const admin = createAdminClient();
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  let userId = userIdHint ?? sub.metadata?.user_id ?? null;
  if (!userId) {
    const { data } = await admin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    userId = data?.user_id ?? null;
  }
  if (!userId) return;

  const periodEnd = sub.items.data[0]?.current_period_end;

  // Only touches subscription columns, so a Lifetime flag is never overwritten
  await admin.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    status: sub.status,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  });
}

// One-time Lifetime purchase: grant only for a paid session created by our own checkout
async function grantLifetime(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;
  if (session.metadata?.plan !== "lifetime") return;
  const userId = session.client_reference_id ?? session.metadata?.user_id;
  if (!userId) return;

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  const grant = {
    lifetime: true,
    stripe_payment_intent_id: paymentIntent,
    updated_at: new Date().toISOString(),
    ...(customerId ? { stripe_customer_id: customerId } : {}),
  };

  if (existing) {
    await admin.from("subscriptions").update(grant).eq("user_id", userId);
  } else {
    await admin.from("subscriptions").insert({ user_id: userId, status: "lifetime", ...grant });
  }
}

// A fully refunded Lifetime payment removes the entitlement
async function revokeLifetime(charge: Stripe.Charge) {
  if (!charge.refunded) return;
  const paymentIntent =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntent) return;

  const admin = createAdminClient();
  await admin
    .from("subscriptions")
    .update({ lifetime: false, updated_at: new Date().toISOString() })
    .eq("stripe_payment_intent_id", paymentIntent);
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.mode === "subscription" && session.subscription) {
        const id =
          typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const sub = await stripe().subscriptions.retrieve(id);
        await saveSubscription(sub, session.client_reference_id);
      } else if (session.mode === "payment") {
        await grantLifetime(session);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await saveSubscription(event.data.object);
      break;
    case "charge.refunded":
      await revokeLifetime(event.data.object);
      break;
  }

  return new Response("ok");
}
