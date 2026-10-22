import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { CreateSpaceForm } from "@/components/create-space-form";
import { FREE_LIMITS, asPlan, siteUrl } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/server";

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = getDictionary(locale).dash.overview;
  const tc = getDictionary(locale).dash.space;
  const { namePh, headlinePh, create, creating } = getDictionary(locale).dash.create;
  const createText = { namePh, headlinePh, create, creating };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: spaces }, { data: stats }, { data: plan }] = await Promise.all([
    supabase
      .from("spaces")
      .select("id, name, slug, headline")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase.from("space_stats").select("space_id, total, approved_count, avg_rating"),
    supabase.rpc("my_plan"),
  ]);

  const statsBySpace = new Map(stats?.map((s) => [s.space_id, s]));
  const approvedTotal = stats?.reduce((n, s) => n + Number(s.approved_count), 0) ?? 0;
  const totalAll = stats?.reduce((n, s) => n + Number(s.total), 0) ?? 0;
  const pending = totalAll - approvedTotal;

  const overview = [
    { label: t.spaces, value: String(spaces?.length ?? 0) },
    { label: t.testimonials, value: String(totalAll) },
    { label: t.awaiting, value: String(pending) },
  ];

  return (
    <>
      <h1 className="display text-4xl">{t.title}</h1>
      <p className="mt-1 text-muted">{t.sub}</p>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {overview.map((o) => (
          <div key={o.label} className="card px-5 py-4">
            <dt className="text-xs text-muted">{o.label}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">{o.value}</dd>
          </div>
        ))}
      </dl>

      {asPlan(plan) === "free" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-2 px-5 py-3.5 text-sm">
          <p className="text-muted">
            {t.freePlan(spaces?.length ?? 0, FREE_LIMITS.spaces, approvedTotal, FREE_LIMITS.approvedTestimonials)}
          </p>
          <Link href="/dashboard/billing" className="font-medium underline underline-offset-4">
            {t.upgrade}
          </Link>
        </div>
      )}

      <section id="new" className="card mt-6 scroll-mt-8 p-5">
        <h2 className="mb-3 text-sm font-medium">{t.createTitle}</h2>
        <CreateSpaceForm t={createText} />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {spaces?.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center lg:col-span-2">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-foreground">
              ★
            </div>
            <p className="font-medium">{t.emptyTitle}</p>
            <p className="mt-1 text-sm text-muted">{t.emptyP}</p>
          </div>
        )}

        {spaces?.map((space) => {
          const s = statsBySpace.get(space.id);
          const tiles = [
            { label: t.testimonials, value: String(s?.total ?? 0) },
            { label: t.approved, value: String(s?.approved_count ?? 0) },
            { label: t.avgRating, value: `${Number(s?.avg_rating ?? 0).toFixed(1)} ★` },
          ];

          return (
            <article key={space.id} className="card flex flex-col p-5">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold">{space.name}</h3>
                <p className="truncate text-sm text-muted">{space.headline}</p>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2">
                {tiles.map((t) => (
                  <div key={t.label} className="rounded-xl bg-background px-3 py-2.5">
                    <dt className="text-[11px] text-muted">{t.label}</dt>
                    <dd className="mt-0.5 text-lg font-semibold">{t.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-center gap-2">
                <Link href={`/dashboard/space/${space.id}`} className="btn-primary btn-sm">
                  {t.manage}
                </Link>
                <CopyButton text={`${siteUrl}${href(locale, `/collect/${space.slug}`)}`} label={t.copyLink} copiedLabel={tc.copied} />
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
