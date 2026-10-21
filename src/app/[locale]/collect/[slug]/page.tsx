import { notFound } from "next/navigation";
import { CollectForm } from "@/components/collect-form";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";

export default async function CollectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).collect;

  const supabase = await createClient();
  const { data: space } = await supabase
    .from("public_spaces")
    .select("id, name, headline")
    .eq("slug", slug)
    .maybeSingle();

  if (!space) notFound();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="relative w-full max-w-md">
        <div className="card p-7 sm:p-8">
          <p className="mb-3 inline-flex rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
            {space.name}
          </p>
          <h1 className="display mb-6 text-4xl leading-tight">{space.headline}</h1>
          <CollectForm spaceId={space.id} locale={locale} />
        </div>
        <p className="mt-4 text-center text-xs text-muted">{t.poweredBy}</p>
      </div>
    </main>
  );
}
