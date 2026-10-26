import { createClient } from "@/lib/supabase/server";
import { HeightReporter } from "@/components/height-reporter";
import { VoicePlayer } from "@/components/voice-player";
import { signAudioUrls } from "@/lib/audio";
import { FREE_LIMITS, siteUrl } from "@/lib/billing";
import { defaultLocale, dirOf, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="text-[#f5a524]" aria-label={label}>
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
  searchParams: Promise<{ theme?: string; lang?: string }>;
}) {
  const [{ spaceId }, { theme, lang }] = await Promise.all([params, searchParams]);
  const locale = lang && isLocale(lang) ? lang : defaultLocale;
  const t = getDictionary(locale).dash.widget;
  const dark = theme === "dark";

  const supabase = await createClient();
  const { data: isPro } = await supabase.rpc("space_is_pro", { space: spaceId });
  const { data: all } = await supabase
    .from("testimonials")
    .select("id, rating, content, client_name, client_title, audio_path, audio_seconds")
    .eq("space_id", spaceId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  // Free plan caps the public wall (covers owners who downgraded with many approved).
  const testimonials = isPro ? all : all?.slice(0, FREE_LIMITS.approvedTestimonials);

  const audioUrls = await signAudioUrls((testimonials ?? []).map((x) => x.audio_path));
  const voice = getDictionary(locale).collect.voice;

  const cardClass = dark
    ? "border-white/10 bg-white/5 text-white"
    : "border-[#e4e4db] bg-white text-[#111111]";
  const mutedClass = dark ? "text-white/60" : "text-[#6f6f68]";

  return (
    <>
      {/* The wall sits on the host page's background */}
      <style>{`html, body { background: transparent !important; }`}</style>
      <HeightReporter spaceId={spaceId} />
      <div lang={locale} dir={dirOf(locale)}>
      <div className="columns-1 gap-4 p-2 sm:columns-2 lg:columns-3">
        {testimonials?.map((x) => (
          <figure key={x.id} className={`mb-4 break-inside-avoid rounded-2xl border p-5 ${cardClass}`}>
            <Stars rating={x.rating} label={t.stars(x.rating)} />
            {x.content && <blockquote className="mt-2 text-[15px] leading-relaxed">{x.content}</blockquote>}
            {x.audio_path && audioUrls.get(x.audio_path) && (
              <VoicePlayer src={audioUrls.get(x.audio_path)!} seconds={x.audio_seconds ?? 0} play={voice.play} pause={voice.pause} dark={dark} />
            )}
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white">
                {x.client_name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm">
                <span className="block font-medium">{x.client_name}</span>
                {x.client_title && <span className={`block text-xs ${mutedClass}`}>{x.client_title}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
        {testimonials?.length === 0 && (
          <p className={`p-4 text-sm ${mutedClass}`}>{t.empty}</p>
        )}
      </div>
      {!isPro && (
        <p className={`px-2 pb-2 text-center text-xs ${mutedClass}`}>
          <a href={siteUrl} target="_blank" rel="noreferrer" className="hover:underline">
            {t.poweredBy}
          </a>
        </p>
      )}
      </div>
    </>
  );
}
