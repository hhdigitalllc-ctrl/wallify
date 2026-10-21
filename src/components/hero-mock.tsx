import { LogoMark } from "@/components/logo";

// Static illustration of the dashboard, with sample content.
const bars = [4, 7, 5, 9, 6, 10, 8];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Card = { name: string; role: string; text: string; stars: number; dark?: boolean };

const columns: { title: string; count: number; cards: Card[] }[] = [
  {
    title: "Pending",
    count: 3,
    cards: [
      { name: "Sample Maker", role: "Indie developer", text: "Set up in two minutes. The wall just appeared on my site.", stars: 5 },
      { name: "Sample Founder", role: "SaaS founder", text: "More reviews in a day than months of emailing.", stars: 5 },
    ],
  },
  {
    title: "Approved",
    count: 12,
    cards: [
      { name: "Sample Designer", role: "Freelancer", text: "I approve everything first. No surprises on my landing page.", stars: 4, dark: true },
      { name: "Sample Creator", role: "Newsletter author", text: "Looks like it belongs on my site. Exactly what I wanted.", stars: 5 },
    ],
  },
  {
    title: "On your site",
    count: 12,
    cards: [
      { name: "Sample Agency", role: "Studio", text: "Our clients love leaving a quick note. Takes them ten seconds.", stars: 5 },
      { name: "Sample Coach", role: "Coach", text: "Dropped the embed into Framer and was done.", stars: 5 },
    ],
  },
];

function Stars({ n, dark }: { n: number; dark?: boolean }) {
  return (
    <span className="text-[11px] text-star" aria-hidden="true">
      {"★".repeat(n)}
      <span className={dark ? "text-white/25" : "text-line"}>{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function HeroMock({ aria, caption }: { aria: string; caption: string }) {
  return (
    <div dir="ltr" className="rounded-[28px] bg-surface-2 p-2.5 sm:p-5" role="img" aria-label={aria}>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-[0_30px_60px_-30px_rgba(17,17,17,0.25)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto rounded-md bg-surface-2 px-12 py-0.5 text-[10px] text-muted">
            wallify · Mood Print
          </span>
        </div>

        <div className="grid sm:grid-cols-[170px_1fr]">
          {/* sidebar */}
          <aside className="hidden border-r border-line p-4 sm:block">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <LogoMark size={20} /> wallify
            </div>
            <ul className="mt-6 space-y-1 text-xs">
              {["Spaces", "Testimonials", "Widget", "Billing"].map((n, i) => (
                <li
                  key={n}
                  className={`rounded-lg px-2.5 py-1.5 ${i === 1 ? "bg-surface-2 font-medium" : "text-muted"}`}
                >
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[10px] uppercase tracking-widest text-muted">Spaces</p>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              <li className="px-2.5 py-1">Mood Print</li>
              <li className="px-2.5 py-1">Cookit</li>
            </ul>
          </aside>

          <div className="p-4 sm:p-5">
            {/* stats */}
            <div className="rounded-xl bg-background p-4">
              <div className="grid items-end gap-4 sm:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                  <p className="text-xs text-muted">New testimonials</p>
                  <div className="mt-2 flex h-20 items-end gap-2">
                    {bars.map((b, i) => (
                      <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                        <div
                          className={`w-full rounded-sm ${i % 2 ? "bg-foreground" : "hatch border border-foreground/30"}`}
                          style={{ height: `${b * 7}%` }}
                        />
                        <span className="text-[9px] text-muted">{days[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted">Average rating</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight">4.9</p>
                  <p className="text-xs text-star">★★★★★</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Live on your site</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight">
                    12<span className="text-lg text-muted"> / 27</span>
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-line">
                    <div className="h-1.5 w-[44%] rounded-full bg-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* kanban */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {columns.map((col, ci) => (
                <div key={col.title} className={ci === 2 ? "hidden sm:block" : ""}>
                  <p className="mb-2 flex items-center justify-between text-sm font-semibold">
                    {col.title}
                    <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                      {col.count}
                    </span>
                  </p>
                  <div className="space-y-2.5">
                    {col.cards.map((c) => (
                      <div
                        key={c.name}
                        className={`rounded-xl border p-3 ${
                          c.dark ? "border-foreground bg-foreground text-background" : "border-line bg-surface"
                        }`}
                      >
                        <p className="text-xs font-semibold">{c.name}</p>
                        <p className={`text-[10px] ${c.dark ? "text-white/60" : "text-muted"}`}>{c.role}</p>
                        <p className={`mt-2 text-[11px] leading-snug ${c.dark ? "text-white/85" : "text-foreground/80"}`}>
                          {c.text}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <Stars n={c.stars} dark={c.dark} />
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                              c.dark ? "bg-white text-foreground" : "bg-surface-2 text-muted"
                            }`}
                          >
                            {col.title === "Pending" ? "Approve" : "Live"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">{caption}</p>
    </div>
  );
}
