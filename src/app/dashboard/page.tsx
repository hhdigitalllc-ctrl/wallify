import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { CopyButton } from "@/components/copy-button";
import { CreateSpaceForm } from "@/components/create-space-form";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: spaces }, { data: stats }] = await Promise.all([
    supabase.from("spaces").select("id, name, slug, headline").order("created_at", { ascending: false }),
    supabase.from("space_stats").select("space_id, total, approved_count, avg_rating"),
  ]);

  const statsBySpace = new Map(stats?.map((s) => [s.space_id, s]));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Wallify</h1>
        <form action={signOut}>
          <button className="text-sm text-neutral-500 hover:text-neutral-900">Log out</button>
        </form>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-medium text-neutral-500">New space</h2>
        <CreateSpaceForm />
      </section>

      <section className="space-y-4">
        {spaces?.length === 0 && (
          <p className="text-sm text-neutral-500">
            No spaces yet. Create one above to get your collection link.
          </p>
        )}

        {spaces?.map((space) => {
          const s = statsBySpace.get(space.id);
          const collectUrl = `${siteUrl}/collect/${space.slug}`;
          const embed = `<script src="${siteUrl}/embed.js" data-space="${space.id}" async></script>`;

          return (
            <article key={space.id} className="rounded-xl border border-neutral-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{space.name}</h3>
                  <p className="text-sm text-neutral-500">{space.headline}</p>
                </div>
                <Link
                  href={`/dashboard/space/${space.id}`}
                  className="text-sm underline underline-offset-2"
                >
                  Manage
                </Link>
              </div>

              <dl className="mt-4 flex gap-8 text-sm">
                <div>
                  <dt className="text-neutral-500">Testimonials</dt>
                  <dd className="font-medium">{s?.total ?? 0}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Approved</dt>
                  <dd className="font-medium">{s?.approved_count ?? 0}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Avg rating</dt>
                  <dd className="font-medium">{Number(s?.avg_rating ?? 0).toFixed(1)} ★</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <CopyButton text={collectUrl} label="Copy collection link" />
                <CopyButton text={embed} label="Copy embed code" />
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
