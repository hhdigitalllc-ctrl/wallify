import { PlanCard } from "@/components/plan-card";
import { asPlan } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { upgraded } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: plan }, { data: spaces }, { data: stats }] = await Promise.all([
    supabase.rpc("my_plan"),
    supabase.from("spaces").select("id").eq("user_id", user!.id),
    supabase.from("space_stats").select("approved_count"),
  ]);
  const approved = stats?.reduce((n, s) => n + Number(s.approved_count), 0) ?? 0;

  return (
    <>
      <h1 className="display text-4xl">Billing</h1>
      <p className="mt-1 text-muted">Your plan, usage and payment details.</p>
      <PlanCard
        plan={asPlan(plan)}
        spaces={spaces?.length ?? 0}
        approved={approved}
        justUpgraded={upgraded === "1"}
      />
    </>
  );
}
