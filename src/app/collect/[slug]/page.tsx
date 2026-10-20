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
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <p className="mb-1 text-sm text-neutral-500">{space.name}</p>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">{space.headline}</h1>
        <CollectForm spaceId={space.id} />
      </div>
    </main>
  );
}
