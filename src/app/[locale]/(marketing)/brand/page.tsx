import type { Metadata } from "next";
import { Logo, LogoMark } from "@/components/logo";

export const metadata: Metadata = {
  title: "Wallify brand identity",
  description: "Logo, colour, typography, voice and UI guidelines for Wallify.",
};

const colors = [
  { name: "Paper", hex: "#F6F6F0", rgb: "246 246 240", use: "Page background. A warm off-white that keeps the product calm.", bg: "#F6F6F0", fg: "#111111" },
  { name: "White", hex: "#FFFFFF", rgb: "255 255 255", use: "Cards, inputs and every surface that holds content.", bg: "#FFFFFF", fg: "#111111" },
  { name: "Sand", hex: "#EFEFE6", rgb: "239 239 230", use: "Section blocks, chips, hatch backgrounds.", bg: "#EFEFE6", fg: "#111111" },
  { name: "Line", hex: "#E4E4DB", rgb: "228 228 219", use: "1px borders, dividers, empty stars.", bg: "#E4E4DB", fg: "#111111" },
  { name: "Ink", hex: "#111111", rgb: "17 17 17", use: "Text, primary buttons, the logo, the one dark highlight per screen.", bg: "#111111", fg: "#F6F6F0" },
  { name: "Mute", hex: "#6F6F68", rgb: "111 111 104", use: "Secondary text and the grey half of a headline.", bg: "#6F6F68", fg: "#FFFFFF" },
  { name: "Star", hex: "#F5A524", rgb: "245 165 36", use: "Ratings only. The single spot of colour in the product.", bg: "#F5A524", fg: "#111111" },
];

const scale = [
  { label: "Display", cls: "display text-5xl", sample: "Let your customers do the talking.", spec: "Geist 600, -4.5% tracking, 1.02 line" },
  { label: "Heading", cls: "display text-3xl", sample: "Three steps. That's it.", spec: "Geist 600, -4.5%" },
  { label: "Body", cls: "text-base", sample: "Collect testimonials with a single link, approve the ones you love, and embed them anywhere.", spec: "Geist 400, 16/26" },
  { label: "Caption", cls: "text-xs text-muted", sample: "Illustration with sample content.", spec: "Geist 400, 12" },
  { label: "Label", cls: "font-mono text-xs uppercase tracking-widest text-muted", sample: "01 · Create a space", spec: "Geist Mono, 12, 10% tracking" },
];

const voice = [
  { dont: "Leverage our best-in-class social proof solution.", yes: "Put your happy customers on your website." },
  { dont: "Unlock the power of user-generated content!", yes: "Ask for a testimonial. Show the good ones." },
  { dont: "Oops! An error has occurred.", yes: "That didn't go through. Try again?" },
];

const donts = [
  "Don't recolour the mark outside Ink and Paper",
  "Don't stretch, rotate or add effects",
  "Don't place it on busy photos without a solid panel",
  "Don't set the wordmark in another typeface",
];

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-line py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">{n}</p>
      <h2 className="display mt-2 text-3xl sm:text-4xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function BrandPage() {
  return (
    <div>
      <main className="mx-auto max-w-5xl px-5">
        <section className="pb-20 pt-16 sm:pt-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Brand identity · v2.0</p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">
            Wallify <span className="fade">brand book.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            How Wallify looks, sounds and behaves. Paper, ink and one quiet star.
          </p>
          <nav className="mt-8 flex flex-wrap gap-2 text-sm">
            {["essence", "logo", "colour", "type", "texture", "voice", "interface", "assets"].map((s) => (
              <a key={s} href={`#${s}`} className="btn-ghost btn-sm capitalize">
                {s}
              </a>
            ))}
          </nav>
        </section>

        <Section id="essence" n="01" title="Essence">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-foreground p-8 text-background sm:col-span-3">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50">Tagline</p>
              <p className="display mt-4 text-3xl sm:text-5xl">
                Let your customers do the <span className="text-white/45">talking.</span>
              </p>
            </div>
            <div className="card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Mission</p>
              <p className="mt-3">Make it effortless for any maker to collect and show real social proof.</p>
            </div>
            <div className="card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Audience</p>
              <p className="mt-3">Indie hackers, creators and small teams who ship products and need trust fast.</p>
            </div>
            <div className="card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Personality</p>
              <ul className="mt-3 space-y-1.5">
                <li><b>Calm.</b> Space, not noise.</li>
                <li><b>Direct.</b> Short words, clear actions.</li>
                <li><b>Crafted.</b> Small details done well.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="logo" n="02" title="Logo">
          <p className="mb-6 max-w-2xl text-muted">
            The mark is a speech bubble with a star cut out of it: a testimonial and its rating in one
            shape. The wordmark is lowercase Geist semibold, set tight.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex h-56 items-center justify-center">
              <Logo href="/brand" size={44} />
            </div>
            <div className="flex h-56 items-center justify-center rounded-2xl bg-foreground text-background">
              <span className="flex items-center gap-3">
                <LogoMark size={44} tone="paper" />
                <span className="display text-4xl leading-none tracking-[-0.05em]">wallify</span>
              </span>
            </div>
            <div className="flex h-56 items-center justify-center rounded-2xl bg-surface-2">
              <Logo href="/brand" size={44} />
            </div>
            <div className="card flex h-56 items-center justify-center gap-8">
              <LogoMark size={96} />
              <LogoMark size={40} />
              <LogoMark size={20} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <h3 className="font-semibold">Clear space and size</h3>
              <p className="mt-2 text-sm text-muted">
                Keep free space equal to the height of the star on every side. Minimum size: 20px for the
                mark alone, 90px wide for the full logo.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold">Please don&apos;t</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {donts.map((d) => (
                  <li key={d}>✕ {d}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="colour" n="03" title="Colour">
          <p className="mb-6 max-w-2xl text-muted">
            Almost everything is paper, white and ink. Colour is rationed: the only hue in the product is
            the star, so ratings are the first thing the eye finds.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-2xl border border-line">
                <div className="flex h-28 items-end p-4" style={{ background: c.bg, color: c.fg }}>
                  <span className="display text-2xl">{c.name}</span>
                </div>
                <div className="bg-surface p-4 text-sm">
                  <p className="font-mono text-xs">
                    {c.hex} <span className="text-muted">· RGB {c.rgb}</span>
                  </p>
                  <p className="mt-1.5 text-muted">{c.use}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex h-4 overflow-hidden rounded-full border border-line" aria-label="Colour balance">
            <div className="w-[55%] bg-[#F6F6F0]" />
            <div className="w-[25%] bg-[#FFFFFF]" />
            <div className="w-[17%] bg-[#111111]" />
            <div className="w-[3%] bg-[#F5A524]" />
          </div>
          <p className="mt-2 text-xs text-muted">Balance: 55% Paper, 25% White, 17% Ink, 3% Star.</p>
        </Section>

        <Section id="type" n="04" title="Typography">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-6">
              <p className="display text-7xl">Aa</p>
              <p className="mt-3 font-semibold">Geist</p>
              <p className="text-sm text-muted">
                One family for everything. Semibold with tight tracking for headlines, regular for reading.
              </p>
            </div>
            <div className="card p-6">
              <p className="font-mono text-7xl tracking-tight">Aa</p>
              <p className="mt-3 font-semibold">Geist Mono</p>
              <p className="text-sm text-muted">Small uppercase labels, numbers in tables, code and embed snippets.</p>
            </div>
          </div>
          <div className="card mt-4 divide-y divide-line">
            {scale.map((t) => (
              <div key={t.label} className="grid gap-2 p-5 sm:grid-cols-[110px_1fr_240px] sm:items-baseline">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">{t.label}</span>
                <span className={t.cls}>{t.sample}</span>
                <span className="font-mono text-xs text-muted">{t.spec}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            Headline pattern: say it in Ink, finish it in Mute. <b className="text-foreground">Turn happy customers into your</b>{" "}
            <span className="fade font-semibold">best marketing.</span>
          </p>
        </Section>

        <Section id="texture" n="05" title="Texture and shape">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-6">
              <div className="flex h-24 items-end gap-2">
                {[40, 70, 50, 90, 60, 100].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${i % 2 ? "bg-foreground" : "hatch border border-foreground/30"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="mt-4 font-semibold">Hatch</p>
              <p className="text-sm text-muted">The signature texture. 135° lines at 4px, used for bars and empty states.</p>
            </div>
            <div className="card p-6">
              <div className="flex h-24 items-center gap-3">
                <div className="h-16 w-16 rounded-2xl border border-line bg-surface" />
                <div className="h-16 w-16 rounded-xl border border-line bg-surface" />
                <div className="h-16 w-16 rounded-lg border border-line bg-surface" />
              </div>
              <p className="mt-4 font-semibold">Radius</p>
              <p className="text-sm text-muted">16px cards, 12px controls, 8px small buttons, 24px big panels.</p>
            </div>
            <div className="rounded-2xl bg-foreground p-6 text-background">
              <div className="flex h-24 items-center">
                <p className="text-sm text-white/70">One dark card per screen to draw the eye.</p>
              </div>
              <p className="mt-4 font-semibold">Contrast</p>
              <p className="text-sm text-white/60">Use the Ink block for the thing you most want noticed.</p>
            </div>
          </div>
        </Section>

        <Section id="voice" n="06" title="Voice and tone">
          <p className="mb-6 max-w-2xl text-muted">
            Talk like a friend who ships products: short sentences, plain words, a little wit. Be most
            helpful when something goes wrong.
          </p>
          <div className="space-y-3">
            {voice.map((v) => (
              <div key={v.yes} className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-surface p-5 text-sm">
                  <p className="mb-1 font-mono text-xs uppercase tracking-widest text-danger">Not us</p>
                  <p className="text-muted line-through decoration-danger/60">{v.dont}</p>
                </div>
                <div className="rounded-2xl bg-foreground p-5 text-sm text-background">
                  <p className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Us</p>
                  <p>{v.yes}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="interface" n="07" title="Interface">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card space-y-4 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Buttons</p>
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary">Primary</button>
                <button className="btn-ghost">Secondary</button>
                <button className="btn-primary btn-sm">Small</button>
              </div>
              <p className="text-sm text-muted">One primary action per view. 12px radius.</p>
            </div>
            <div className="card space-y-4 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Inputs</p>
              <input className="input" placeholder="Your name" readOnly />
              <p className="text-sm text-muted">White fill, Ink focus ring.</p>
            </div>
            <div className="card space-y-3 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Rating</p>
              <p className="text-3xl text-star">
                ★★★★<span className="text-line">★</span>
              </p>
              <p className="text-sm text-muted">Star filled, Line empty. Never any other colour.</p>
            </div>
            <div className="card space-y-3 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Status</p>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-success">Live on your wall</span>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-muted">Awaiting approval</span>
                <span className="rounded-full bg-danger/10 px-2.5 py-0.5 text-danger">Error</span>
              </div>
              <p className="text-sm text-muted">Tinted fills, never solid blocks.</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            The embeddable widget is light by default so it fits any host site, with{" "}
            <code className="font-mono text-foreground">?theme=dark</code> for dark pages.
          </p>
        </Section>

        <Section id="assets" n="08" title="Assets">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { file: "logo-mark.svg", label: "Mark, Ink (for light backgrounds)", bg: "bg-surface-2" },
              { file: "logo-mark-paper.svg", label: "Mark, Paper (for dark backgrounds)", bg: "bg-foreground" },
            ].map((a) => (
              <a
                key={a.file}
                href={`/brand/${a.file}`}
                download
                className="card overflow-hidden transition hover:border-foreground/40"
              >
                <div className={`flex h-32 items-center justify-center ${a.bg}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/${a.file}`} alt="" width={64} height={64} />
                </div>
                <div className="flex items-center justify-between p-4 text-sm">
                  <span>{a.label}</span>
                  <span className="font-mono text-xs">↓ SVG</span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            Social avatar: the Paper mark on an Ink square, 20% padding. Favicon: the same, rounded.
          </p>
        </Section>
      </main>

    </div>
  );
}
