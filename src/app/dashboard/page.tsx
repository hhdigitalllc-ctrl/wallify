import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { CopyButton } from "@/components/copy-button";
import { CreateSpaceForm } from "@/components/create-space-form";
import { Logo } from "@/components/logo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: spaces }, { data: stats }] = await Promise.all([
    supabase.from("spaces").select("id, name, slug, headline").order("created_at", { ascending: false }),
    supabase.from("space_stats").select("space_id, total, approved_count, avg_rating"),
  ]);

  const statsBySpace = new Map(stats?.map((s) => [s.space_id, s]));

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3.5">
          <Logo href="/dashboard" />
          <form action={signOut}>
            <button className="btn-ghost btn-sm">Log out</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-10">
        <h1 className="display text-4xl">Your spaces</h1>
        <p className="mt-1 text-muted">Each space has its own collection link and embeddable wall.</p>

        <section className="card mt-6 p-5">
          <h2 className="mb-3 text-sm font-medium">Create a new space</h2>
          <CreateSpaceForm />
        </section>

        <section className="mt-8 space-y-4">
          {spaces?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                ★
              </div>
              <p className="font-medium">No spaces yet</p>
              <p className="mt-1 text-sm text-muted">
                Create your first space above to get a public collection link.
              </p>
            </div>
          )}

          {spaces?.map((space) => {
            const s = statsBySpace.get(space.id);
            const collectUrl = `${siteUrl}/collect/${space.slug}`;
            const embed = `<script src="${siteUrl}/embed.js" data-space="${space.id}" async></script>`;
            const tiles = [
              { label: "Testimonials", value: String(s?.total ?? 0) },
              { label: "Approved", value: String(s?.approved_count ?? 0) },
              { label: "Avg rating", value: `${Number(s?.avg_rating ?? 0).toFixed(1)} ★` },
            ];

            return (
              <article key={space.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">{space.name}</h3>
                    <p className="truncate text-sm text-muted">{space.headline}</p>
                  </div>
                  <Link href={`/dashboard/space/${space.id}`} className="btn-primary btn-sm shrink-0">
                    Manage
                  </Link>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-3">
                  {tiles.map((t) => (
                    <div key={t.label} className="rounded-xl bg-background px-3.5 py-3">
                      <dt className="text-xs text-muted">{t.label}</dt>
                      <dd className="mt-0.5 text-xl font-semibold">{t.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <CopyButton text={collectUrl} label="Copy collection link" />
                  <CopyButton text={embed} label="Copy embed code" />
                  <a
                    href={`/collect/${space.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost btn-sm"
                  >
                    Open form ↗
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}
