import { createClient } from "@/lib/supabase/server";
import { HeightReporter } from "@/components/height-reporter";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-neutral-300">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ spaceId: string }>;
}) {
  const { spaceId } = await params;
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, rating, content, client_name, client_title")
    .eq("space_id", spaceId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* The wall sits on the host page's background */}
      <style>{`html, body { background: transparent !important; }`}</style>
      <HeightReporter spaceId={spaceId} />
      <div className="columns-1 gap-4 p-2 sm:columns-2 lg:columns-3">
        {testimonials?.map((t) => (
          <figure
            key={t.id}
            className="mb-4 break-inside-avoid rounded-xl border border-neutral-200 bg-white p-5 text-neutral-900"
          >
            <Stars rating={t.rating} />
            <blockquote className="mt-2 text-sm leading-relaxed">{t.content}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
                {t.client_name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm">
                <span className="block font-medium">{t.client_name}</span>
                {t.client_title && (
                  <span className="block text-xs text-neutral-500">{t.client_title}</span>
                )}
              </span>
            </figcaption>
          </figure>
        ))}
        {testimonials?.length === 0 && (
          <p className="p-4 text-sm text-neutral-500">No testimonials yet.</p>
        )}
      </div>
    </>
  );
}
