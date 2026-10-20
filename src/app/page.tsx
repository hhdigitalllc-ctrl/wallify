import Link from "next/link";
import { Logo } from "@/components/logo";

const sample = [
  { r: 5, t: "Setup took two minutes. I pasted one line into Framer and the wall just appeared.", n: "Sample Maker", s: "Indie developer" },
  { r: 5, t: "Sending a single link to customers got me more reviews in a day than months of asking by email.", n: "Sample Founder", s: "SaaS founder" },
  { r: 4, t: "I love that I approve everything before it goes public. No surprises on my landing page.", n: "Sample Designer", s: "Freelance designer" },
  { r: 5, t: "Clean, fast, and it looks like it belongs on my site. Exactly what I wanted.", n: "Sample Creator", s: "Newsletter author" },
];

const steps = [
  { n: "01", h: "Create a space", p: "Name your product, pick a headline, and get a public link in seconds." },
  { n: "02", h: "Collect love", p: "Share the link. Customers leave a star rating and a few words, no account needed." },
  { n: "03", h: "Embed the wall", p: "Approve your favorites and paste one line of code into any website." },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
      <span className="text-line">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-240px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />

      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-5xl px-5">
        <section className="mx-auto max-w-2xl pb-16 pt-16 text-center sm:pt-24">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Social proof, minus the busywork
          </p>
          <h1 className="display text-5xl leading-[1.05] sm:text-7xl">
            Turn happy customers into your <em className="text-accent">best marketing</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Collect testimonials with a single link, approve the ones you love, and embed a
            beautiful wall of proof on any website.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/signup" className="btn btn-primary px-6 py-3">
              Start collecting, it&apos;s free
            </Link>
            <a href="#how" className="btn btn-ghost px-6 py-3">
              How it works
            </a>
          </div>
        </section>

        <section aria-label="Example testimonial wall" className="pb-24">
          <div className="columns-1 gap-4 sm:columns-2">
            {sample.map((s) => (
              <figure key={s.t} className="card mb-4 break-inside-avoid p-5">
                <Stars n={s.r} />
                <blockquote className="mt-2 text-[15px] leading-relaxed">{s.t}</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-medium text-accent-ink">
                    {s.n.split(" ")[1].charAt(0)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-medium">{s.n}</span>
                    <span className="block text-xs text-muted">{s.s}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-center text-xs text-muted">Example wall with sample content.</p>
        </section>

        <section id="how" className="pb-24">
          <h2 className="display mb-10 text-center text-4xl sm:text-5xl">Three steps. That&apos;s it.</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card p-6">
                <span className="text-sm font-medium text-accent">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.h}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-24">
          <div className="rounded-3xl bg-foreground px-6 py-14 text-center text-white">
            <h2 className="display text-4xl sm:text-5xl">Your customers are already talking.</h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">
              Give them a place to say it, and put it where your next customer will see it.
            </p>
            <Link href="/signup" className="btn mt-7 bg-white px-6 py-3 text-foreground hover:bg-accent-soft">
              Create your first space
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative mx-auto max-w-5xl px-5 pb-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} Wallify
      </footer>
    </div>
  );
}
