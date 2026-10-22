import { SubmitButton } from "@/components/submit-button";
import { openPortal, startCheckout } from "@/app/dashboard/billing-actions";
import type { Dictionary } from "@/i18n/get-dictionary";
import { FREE_LIMITS, PRO_PRICE_USD, billingEnabled, type Plan } from "@/lib/billing";

type Props = {
  plan: Plan;
  spaces: number;
  approved: number;
  justUpgraded: boolean;
  portalError?: boolean;
  lifetimePrice: number;
  t: Dictionary["dash"]["billing"];
};

export function PlanCard({ plan, spaces, approved, justUpgraded, portalError, lifetimePrice, t }: Props) {
  if (plan !== "free") {
    return (
      <section className="card mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="flex items-center gap-2 font-medium">
            <span className="rounded-full bg-foreground px-2.5 py-0.5 text-xs font-semibold text-background">
              {plan === "lifetime" ? "Lifetime" : "Pro"}
            </span>
            {plan === "lifetime" ? t.lifetimeLine : t.proLine}
          </p>
          <p className="mt-1 text-sm text-muted">{t.proFeatures}</p>
        </div>
        {portalError && (
          <p className="w-full rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {t.portalError}
          </p>
        )}
        {plan === "pro" && (
          <form action={openPortal}>
            <SubmitButton className="btn-ghost btn-sm">{t.manage}</SubmitButton>
          </form>
        )}
      </section>
    );
  }

  const bar = (value: number, max: number) => Math.min(100, Math.round((value / max) * 100));
  const enabled = billingEnabled();

  return (
    <section className="card mt-6 p-5">
      {justUpgraded && (
        <p className="mb-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          {t.paid}
        </p>
      )}

      <p className="font-medium">{t.freePlan}</p>
      <div className="mt-3 space-y-3 text-sm sm:max-w-sm">
        {[
          { label: t.spacesLabel, value: spaces, max: FREE_LIMITS.spaces },
          { label: t.approvedLabel, value: approved, max: FREE_LIMITS.approvedTestimonials },
        ].map((m) => (
          <div key={m.label}>
            <div className="mb-1 flex justify-between text-muted">
              <span>{m.label}</span>
              <span>
                {m.value} / {m.max}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-background">
              <div className="h-1.5 rounded-full bg-foreground" style={{ width: `${bar(m.value, m.max)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-foreground p-5 text-background">
          <p className="display text-2xl">
            Pro <span className="text-base font-medium tracking-normal text-white/60">${PRO_PRICE_USD}{t.perMonth}</span>
          </p>
          <p className="mt-1 text-sm text-white/65">{t.proDesc}</p>
          {enabled ? (
            <form action={startCheckout}>
              <input type="hidden" name="plan" value="pro" />
              <SubmitButton className="btn mt-4 w-full bg-white text-foreground hover:bg-surface-2" pendingText={t.redirecting}>
                {t.upgradePro}
              </SubmitButton>
            </form>
          ) : (
            <p className="mt-4 text-xs text-white/60">{t.notConfigured}</p>
          )}
        </div>

        <div className="rounded-xl bg-surface-2 p-5">
          <p className="display text-2xl">
            Lifetime <span className="text-base font-medium tracking-normal text-muted">${lifetimePrice} {t.once}</span>
          </p>
          <p className="mt-1 text-sm text-muted">{t.lifetimeDesc}</p>
          {enabled ? (
            <form action={startCheckout}>
              <input type="hidden" name="plan" value="lifetime" />
              <SubmitButton className="btn-primary mt-4 w-full" pendingText={t.redirecting}>
                {t.getLifetime}
              </SubmitButton>
            </form>
          ) : (
            <p className="mt-4 text-xs text-muted">{t.notConfigured}</p>
          )}
        </div>
      </div>
    </section>
  );
}
