import Link from "next/link";
import { LIFETIME_PRICE_USD, PRO_PRICE_USD } from "@/lib/billing";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function Plans({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).plans;
  const plans = [
    { ...t.free, price: "$0", kind: "plain" as const },
    { ...t.pro, price: `$${PRO_PRICE_USD}`, kind: "featured" as const, badge: t.popular },
    { ...t.lifetime, price: `$${LIFETIME_PRICE_USD}`, kind: "value" as const, badge: t.best },
  ];

  return (
    <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
      {plans.map((p) => {
        const dark = p.kind === "featured";
        return (
          <div
            key={p.name}
            className={`flex flex-col rounded-3xl p-8 ${
              dark
                ? "bg-foreground text-background"
                : p.kind === "value"
                  ? "border-2 border-foreground bg-surface"
                  : "border border-line bg-surface"
            }`}
          >
            <p className="flex items-center gap-2 text-sm font-semibold">
              {p.name}
              {"badge" in p && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    dark ? "bg-white text-foreground" : "bg-foreground text-background"
                  }`}
                >
                  {p.badge}
                </span>
              )}
            </p>
            <p className="display mt-4 text-6xl" dir="ltr" style={{ textAlign: locale === "ar" ? "right" : "left" }}>
              {p.price}
              <span className={`ms-2 text-sm font-medium tracking-normal ${dark ? "text-white/55" : "text-muted"}`}>
                {p.note}
              </span>
            </p>
            <ul className="mt-7 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span>✓</span>
                  <span className={dark ? "text-white/80" : "text-foreground/80"}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={href(locale, "/signup")}
              className={`btn mt-8 w-full py-3 ${
                dark ? "bg-white text-foreground hover:bg-surface-2" : "btn-primary"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
