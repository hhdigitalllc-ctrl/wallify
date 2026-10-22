import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyField } from "@/components/copy-field";
import { SubmitButton } from "@/components/submit-button";
import { FREE_LIMITS, siteUrl } from "@/lib/billing";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/server";
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
  const locale = await getLocale();
  const t = getDictionary(locale).dash.space;
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

  const collectPath = href(locale, `/collect/${space.slug}`);
  const wallPath = href(locale, `/wall/${space.slug}`);
  const collectUrl = `${siteUrl}${collectPath}`;
  const wallUrl = `${siteUrl}${wallPath}`;
  const embed = `<script src="${siteUrl}/embed.js" data-space="${space.id}"${locale === "en" ? "" : ` data-lang="${locale}"`} async></script>`;
  const mailto = `mailto:?subject=${encodeURIComponent(t.mailSubject(space.name))}&body=${encodeURIComponent(t.mailBody(space.name, collectUrl))}`;

  const tiles = [
    { label: t.total, value: String(list.length) },
    { label: t.live, value: String(approved) },
    { label: t.avg, value: `${avg.toFixed(1)} ★` },
  ];

  return (
    <>
      <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
        {t.back}
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
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">{t.collectStep}</h2>
          <CopyField
            label={t.collectionLink}
            hint={t.collectHint}
            copyLabel={t.copy}
            copiedLabel={t.copied}
            value={collectUrl}
            actions={[
              { label: t.open, href: collectPath, external: true },
              { label: t.emailRequest, href: mailto },
            ]}
          />
        </div>
        <div className="space-y-5 p-5">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted">{t.showStep}</h2>
          <CopyField
            label={t.wallPage}
            hint={t.wallHint}
            copyLabel={t.copy}
            copiedLabel={t.copied}
            value={wallUrl}
            actions={[{ label: t.open, href: wallPath, external: true }]}
          />
          <CopyField label={t.embedCode} hint={t.embedHint} value={embed} copyLabel={t.copy} copiedLabel={t.copied} />
        </div>
      </section>

      {limit === "1" && (
        <p className="mt-6 rounded-xl bg-surface-2 px-4 py-3 text-sm text-foreground">
          {t.limitA(FREE_LIMITS.approvedTestimonials)}{" "}
          <Link href="/dashboard/billing" className="font-medium underline">
            {t.limitUpgrade}
          </Link>{" "}
          {t.limitB}
        </p>
      )}

      <section className="mt-10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-muted">{t.testimonials(list.length)}</h2>
          {pending > 0 && (
            <details className="group relative">
              <summary className="btn-ghost btn-sm cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                {t.deleteAll(pending)}
              </summary>
              <div className="absolute end-0 z-10 mt-2 w-64 rounded-2xl border border-line bg-surface p-4 shadow-lg">
                <p className="text-sm">
                  {t.deleteWarn(pending)}
                </p>
                <form action={deleteAllPending} className="mt-3">
                  <input type="hidden" name="space_id" value={space.id} />
                  <SubmitButton className="btn-primary btn-sm w-full">{t.deleteYes}</SubmitButton>
                </form>
              </div>
            </details>
          )}
        </div>

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
            {t.empty}
          </div>
        )}

        {list.map((x) => (
          <article key={x.id} className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-star">
                {"★".repeat(x.rating)}
                <span className="text-line">{"★".repeat(5 - x.rating)}</span>
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  x.approved ? "bg-success/10 text-success" : "bg-surface-2 text-muted"
                }`}
              >
                {x.approved ? t.live : t.pending}
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed">{x.content}</p>
            <p className="mt-3 text-sm text-muted">
              <span className="font-medium text-foreground">{x.client_name}</span>
              {x.client_title ? `, ${x.client_title}` : ""}
            </p>
            <div className="mt-4 flex gap-2">
              <form action={setApproved}>
                <input type="hidden" name="id" value={x.id} />
                <input type="hidden" name="space_id" value={space.id} />
                <input type="hidden" name="approved" value={String(!x.approved)} />
                <SubmitButton className={x.approved ? "btn-ghost btn-sm" : "btn-primary btn-sm"}>
                  {x.approved ? t.unapprove : t.approve}
                </SubmitButton>
              </form>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={x.id} />
                <SubmitButton className="btn-ghost btn-sm text-danger">{t.delete}</SubmitButton>
              </form>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-3 text-sm font-medium text-muted">{t.preview}</h2>
        <iframe
          src={`/widget/${space.id}${locale === "en" ? "" : `?lang=${locale}`}`}
          title={t.previewTitle}
          className="h-[480px] w-full rounded-2xl border border-dashed border-line bg-white/[0.03]"
        />
      </section>
    </>
  );
}
