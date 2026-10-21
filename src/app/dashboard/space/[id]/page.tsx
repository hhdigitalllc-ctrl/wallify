import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyField } from "@/components/copy-field";
import { SubmitButton } from "@/components/submit-button";
import { siteUrl } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { deleteAllPending, deleteTestimonial, setApproved } from "./actions";

export default async function SpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ limit?: string }>;
}) {
  const [{ id }, { limit }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: space } = await supabase
    .from("spaces")
    .select("id, name, slug, headline")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!space) notFound();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, rating, content, client_name, client_title, approved, created_at")
    .eq("space_id", id)
    .order("created_at", { ascending: false });

  const list = testimonials ?? [];
  const approved = list.filter((t) => t.approved).length;
  const pending = list.length - approved;
  const avg = list.length ? list.reduce((n, t) => n + t.rating, 0) / list.length : 0;

  const collectUrl = `${siteUrl}/collect/${space.slug}`;
  const wallUrl = `${siteUrl}/wall/${space.slug}`;
  const embed = `<script src="${siteUrl}/embed.js" data-space="${space.id}" async></script>`;
  const mailto = `mailto:?subject=${encodeURIComponent(`Could you share a quick testimonial about ${space.name}?`)}&body=${encodeURIComponent(`Hi,

Thanks for using ${space.name}! If you have a minute, I'd love to hear what you think. It takes about ten seconds:

${collectUrl}

Thank you!`)}`;

  const tiles = [
    { label: "Testimonials", value: String(list.length) },
    { label: "Live on your wall", value: String(approved) },
    { label: "Avg rating", value: `${avg.toFixed(1)} ★` },
  ];

  return (
    <>
      <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
        ← Overview
      </Link>
      <h1 className="display mt-2 text-4xl">{space.name}</h1>
      <p className="mt-1 text-muted">{space.headline}</p>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="card px-5 py-4">
            <dt className="text-xs text-muted">{t.label}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">{t.value}</dd>
          </div>
        ))}
      </dl>

      {/* Share and embed: every link and snippet for this space, in one place */}
      <section className="card mt-6 divide-y divide-line">
        <div className="space-y-5 p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">1 · Collect</h2>
          <CopyField
            label="Collection link"
            hint="Send this to your customers"
            value={collectUrl}
            actions={[
              { label: "Open ↗", href: `/collect/${space.slug}`, external: true },
              { label: "Email a request", href: mailto },
            ]}
          />
        </div>
        <div className="space-y-5 p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">2 · Show</h2>
          <CopyField
            label="Public wall page"
            hint="A shareable page, no embed needed"
            value={wallUrl}
            actions={[{ label: "Open ↗", href: `/wall/${space.slug}`, external: true }]}
          />
          <CopyField label="Embed code" hint="Paste into Framer, Webflow, WordPress or HTML" value={embed} />
        </div>
      </section>

      {limit === "1" && (
        <p className="mt-6 rounded-xl bg-surface-2 px-4 py-3 text-sm text-foreground">
          The free plan shows up to 10 approved testimonials.{" "}
          <Link href="/dashboard/billing" className="font-medium underline">
            Upgrade to Pro
          </Link>{" "}
          to approve more.
        </p>
      )}

      <section className="mt-10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-muted">Testimonials ({list.length})</h2>
          {pending > 0 && (
            <details className="group relative">
              <summary className="btn-ghost btn-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                Delete all pending ({pending})
              </summary>
              <div className="absolute end-0 z-10 mt-2 w-64 rounded-2xl border border-line bg-surface p-4 shadow-lg">
                <p className="text-sm">
                  This permanently deletes {pending} pending testimonial{pending === 1 ? "" : "s"}. Approved ones stay.
                </p>
                <form action={deleteAllPending} className="mt-3">
                  <input type="hidden" name="space_id" value={space.id} />
                  <SubmitButton className="btn-primary btn-sm w-full">Yes, delete them</SubmitButton>
                </form>
              </div>
            </details>
          )}
        </div>

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
            Nothing yet. Share your collection link and the first testimonial will appear here.
          </div>
        )}

        {list.map((t) => (
          <article key={t.id} className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-star">
                {"★".repeat(t.rating)}
                <span className="text-line">{"★".repeat(5 - t.rating)}</span>
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  t.approved ? "bg-success/10 text-success" : "bg-surface-2 text-muted"
                }`}
              >
                {t.approved ? "Live on your wall" : "Awaiting approval"}
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">{t.content}</p>
            <p className="mt-3 text-sm text-muted">
              <span className="font-medium text-foreground">{t.client_name}</span>
              {t.client_title ? `, ${t.client_title}` : ""}
            </p>
            <div className="mt-4 flex gap-2">
              <form action={setApproved}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="space_id" value={space.id} />
                <input type="hidden" name="approved" value={String(!t.approved)} />
                <SubmitButton className={t.approved ? "btn-ghost btn-sm" : "btn-primary btn-sm"}>
                  {t.approved ? "Unapprove" : "Approve"}
                </SubmitButton>
              </form>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <SubmitButton className="btn-ghost btn-sm text-danger">Delete</SubmitButton>
              </form>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-3 text-sm font-medium text-muted">Live preview</h2>
        <iframe
          src={`/widget/${space.id}`}
          title="Widget preview"
          className="h-[480px] w-full rounded-2xl border border-dashed border-line bg-white/[0.03]"
        />
      </section>
    </>
  );
}
