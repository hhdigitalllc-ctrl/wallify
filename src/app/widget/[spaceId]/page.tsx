import { createClient } from "@/lib/supabase/server";
import { HeightReporter } from "@/components/height-reporter";
import { FREE_LIMITS, siteUrl } from "@/lib/billing";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-[#f5a524]" aria-label={`${rating} out of 5 stars`}>
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
  const { data: isPro } = await supabase.rpc("space_is_pro", { space: spaceId });
  const { data: all } = await supabase
    .from("testimonials")
    .select("id, rating, content, client_name, client_title")
    .eq("space_id", spaceId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  // Free plan caps the public wall (covers owners who downgraded with many approved).
  const testimonials = isPro ? all : all?.slice(0, FREE_LIMITS.approvedTestimonials);

  const cardClass = dark
    ? "border-white/10 bg-white/5 text-white"
    : "border-[#e4e4db] bg-white text-[#111111]";
  const mutedClass = dark ? "text-white/60" : "text-[#6f6f68]";

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
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white">
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
      {!isPro && (
        <p className={`px-2 pb-2 text-center text-xs ${mutedClass}`}>
          <a href={siteUrl} target="_blank" rel="noreferrer" className="hover:underline">
            Powered by Wallify
          </a>
        </p>
      )}
    </>
  );
}
