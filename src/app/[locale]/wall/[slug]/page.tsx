import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/logo";
import { VoicePlayer } from "@/components/voice-player";
import { signAudioUrls } from "@/lib/audio";
import { href, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { FREE_LIMITS } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function loadSpace(slug: string) {
  const supabase = await createClient();
  const { data: space } = await supabase
    .from("public_spaces")
    .select("id, name, headline")
    .eq("slug", slug)
    .maybeSingle();
  return { supabase, space };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).wall;
  const { space } = await loadSpace(slug);
  if (!space) return { title: t.titleA + " " + t.titleB };
  return { title: t.metaTitle(space.name), description: t.metaDesc(space.name) };
}

export default async function WallPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).wall;

  const { supabase, space } = await loadSpace(slug);
  if (!space) notFound();

  const { data: isPro } = await supabase.rpc("space_is_pro", { space: space.id });
  const { data: all } = await supabase
    .from("testimonials")
    .select("id, rating, content, client_name, client_title, audio_path, audio_seconds")
    .eq("space_id", space.id)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  const testimonials = isPro ? all : all?.slice(0, FREE_LIMITS.approvedTestimonials);
  const audioUrls = await signAudioUrls((testimonials ?? []).map((x) => x.audio_path));
  const voice = getDictionary(locale).collect.voice;
  const count = testimonials?.length ?? 0;
  const avg = count ? testimonials!.reduce((n, x) => n + x.rating, 0) / count : 0;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">{space.name}</p>
        <h1 className="display mt-3 text-4xl sm:text-6xl">
          {t.titleA} <span className="fade">{t.titleB}</span>
        </h1>
        {count > 0 && (
          <p className="mt-5 text-muted">
            <span className="text-star">★</span> {t.average(avg.toFixed(1), count)}
          </p>
        )}
        <Link href={href(locale, `/collect/${slug}`)} className="btn btn-primary mt-7">
          {t.leave}
        </Link>
      </header>

      <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {testimonials?.map((x) => (
          <figure key={x.id} className="card mb-4 break-inside-avoid p-6">
            <div className="text-star" aria-label={`${x.rating} / 5`}>
              {"★".repeat(x.rating)}
              <span className="text-line">{"★".repeat(5 - x.rating)}</span>
            </div>
            {x.content && <blockquote className="mt-3 text-[15px] leading-relaxed">{x.content}</blockquote>}
            {x.audio_path && audioUrls.get(x.audio_path) && (
              <VoicePlayer src={audioUrls.get(x.audio_path)!} seconds={x.audio_seconds ?? 0} play={voice.play} pause={voice.pause} />
            )}
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {x.client_name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm">
                <span className="block font-semibold">{x.client_name}</span>
                {x.client_title && <span className="block text-xs text-muted">{x.client_title}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {count === 0 && <p className="mt-10 text-center text-muted">{t.empty}</p>}

      {!isPro && (
        <p className="mt-14 flex items-center justify-center gap-2 text-xs text-muted">
          {t.poweredBy} <Logo size={16} />
        </p>
      )}
    </main>
  );
}
