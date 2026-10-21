import { LEGAL_EMAIL, getLegal, type LegalKind } from "@/i18n/legal";
import type { Locale } from "@/i18n/config";

export function LegalPage({ locale, kind }: { locale: Locale; kind: LegalKind }) {
  const set = getLegal(locale);
  const doc = set[kind];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:pt-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">{set.kicker}</p>
      <h1 className="display mt-3 text-4xl sm:text-6xl">{doc.title}</h1>
      <p className="mt-4 font-mono text-xs text-muted">
        {set.updatedLabel} · {doc.updated}
      </p>

      <p className="mt-8 rounded-2xl border border-line bg-surface p-6 text-lg leading-relaxed">{doc.lede}</p>

      <div className="mt-12 space-y-10">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-semibold tracking-tight">{s.h}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-foreground/80">
              {s.p.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 border-t border-line pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">{set.questions}</p>
        <a href={`mailto:${LEGAL_EMAIL}`} className="mt-2 inline-block text-lg underline underline-offset-4" dir="ltr">
          {LEGAL_EMAIL}
        </a>
      </div>
    </main>
  );
}
