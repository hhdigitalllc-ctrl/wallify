import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/logo";
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

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3.5">
          <Logo href="/dashboard" />
          <Link href="/dashboard" className="btn-ghost btn-sm">
            ← All spaces
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-10">
        <h1 className="display text-4xl">{space.name}</h1>
        <p className="mt-1 text-sm text-muted">
          Collection link: <span className="font-mono text-foreground">/collect/{space.slug}</span>
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="text-sm font-medium text-muted">
            Testimonials ({testimonials?.length ?? 0})
          </h2>

          {testimonials?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
              Nothing yet. Share your collection link and the first testimonial will appear here.
            </div>
          )}

          {testimonials?.map((t) => (
            <article key={t.id} className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-amber-400">
                  {"★".repeat(t.rating)}
                  <span className="text-line">{"★".repeat(5 - t.rating)}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    t.approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
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
                  <input type="hidden" name="approved" value={String(!t.approved)} />
                  <button className={t.approved ? "btn-ghost btn-sm" : "btn-primary btn-sm"}>
                    {t.approved ? "Unapprove" : "Approve"}
                  </button>
                </form>
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="btn-ghost btn-sm text-red-600">Delete</button>
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
            className="h-[480px] w-full rounded-2xl border border-dashed border-line bg-white/50"
          />
        </section>
      </main>
    </>
  );
}
