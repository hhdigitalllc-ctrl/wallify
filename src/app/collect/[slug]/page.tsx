import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CollectForm } from "@/components/collect-form";

export default async function CollectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: space } = await supabase
    .from("spaces")
    .select("id, name, headline")
    .eq("slug", slug)
    .maybeSingle();

  if (!space) notFound();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-200px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />
      <div className="relative w-full max-w-md">
        <div className="card p-7 sm:p-8">
          <p className="mb-3 inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-ink">
            {space.name}
          </p>
          <h1 className="display mb-6 text-4xl leading-tight">{space.headline}</h1>
          <CollectForm spaceId={space.id} />
        </div>
        <p className="mt-4 text-center text-xs text-muted">Powered by Wallify</p>
      </div>
    </main>
  );
}
