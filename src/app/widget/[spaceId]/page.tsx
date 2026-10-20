import { createClient } from "@/lib/supabase/server";
import { HeightReporter } from "@/components/height-reporter";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="opacity-25">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

export default async function WidgetPage({
  params,
  searchParams,
}: {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const [{ spaceId }, { theme }] = await Promise.all([params, searchParams]);
  const dark = theme === "dark";

  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, rating, content, client_name, client_title")
    .eq("space_id", spaceId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  const cardClass = dark
    ? "border-white/10 bg-white/5 text-white"
    : "border-[#e9e5de] bg-white text-[#1a1a2e] shadow-[0_1px_2px_rgba(26,26,46,0.04),0_8px_24px_-12px_rgba(26,26,46,0.1)]";
  const mutedClass = dark ? "text-white/60" : "text-[#6b6b80]";

  return (
    <>
      {/* The wall sits on the host page's background */}
      <style>{`html, body { background: transparent !important; }`}</style>
      <HeightReporter spaceId={spaceId} />
      <div className="columns-1 gap-4 p-2 sm:columns-2 lg:columns-3">
        {testimonials?.map((t) => (
          <figure key={t.id} className={`mb-4 break-inside-avoid rounded-2xl border p-5 ${cardClass}`}>
            <Stars rating={t.rating} />
            <blockquote className="mt-2 text-[15px] leading-relaxed">{t.content}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5b4bff] text-sm font-medium text-white">
                {t.client_name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm">
                <span className="block font-medium">{t.client_name}</span>
                {t.client_title && <span className={`block text-xs ${mutedClass}`}>{t.client_title}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
        {testimonials?.length === 0 && (
          <p className={`p-4 text-sm ${mutedClass}`}>No testimonials yet.</p>
        )}
      </div>
    </>
  );
}
