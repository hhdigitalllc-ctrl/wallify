import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteTestimonial, setApproved } from "./actions";

export default async function SpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: space } = await supabase
    .from("spaces")
    .select("id, name, slug")
    .eq("id", id)
    .maybeSingle();
  if (!space) notFound();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, rating, content, client_name, client_title, approved, created_at")
    .eq("space_id", id)
    .order("created_at", { ascending: false });

  const button = "rounded-md border border-neutral-300 px-2.5 py-1 text-xs hover:bg-neutral-100";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Back
      </Link>
      <h1 className="mt-2 mb-8 text-2xl font-semibold tracking-tight">{space.name}</h1>

      <section className="mb-12 space-y-3">
        <h2 className="text-sm font-medium text-neutral-500">
          Testimonials ({testimonials?.length ?? 0})
        </h2>

        {testimonials?.length === 0 && (
          <p className="text-sm text-neutral-500">
            Nothing yet. Share your collection link: /collect/{space.slug}
          </p>
        )}

        {testimonials?.map((t) => (
          <article key={t.id} className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-amber-400">
                {"★".repeat(t.rating)}
                <span className="text-neutral-300">{"★".repeat(5 - t.rating)}</span>
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  t.approved ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {t.approved ? "Approved" : "Pending"}
              </span>
            </div>
            <p className="mt-2 text-sm">{t.content}</p>
            <p className="mt-2 text-xs text-neutral-500">
              {t.client_name}
              {t.client_title ? `, ${t.client_title}` : ""}
            </p>
            <div className="mt-3 flex gap-2">
              <form action={setApproved}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="approved" value={String(!t.approved)} />
                <button className={button}>{t.approved ? "Unapprove" : "Approve"}</button>
              </form>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <button className={`${button} text-red-600`}>Delete</button>
              </form>
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-500">Live preview</h2>
        <iframe
          src={`/widget/${space.id}`}
          title="Widget preview"
          className="h-[480px] w-full rounded-xl border border-dashed border-neutral-300"
        />
      </section>
    </main>
  );
}
