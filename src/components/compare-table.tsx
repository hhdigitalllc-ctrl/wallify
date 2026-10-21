import type { Dictionary } from "@/i18n/get-dictionary";

export function CompareTable({ t }: { t: Dictionary["compareTable"] }) {
  const rows = t.rows;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="grid grid-cols-[1fr_1fr] text-sm sm:grid-cols-[1.1fr_1fr_1fr]">
        <div className="hidden border-b border-line p-5 sm:block" />
        <div className="border-b border-line p-5 font-semibold text-muted">{t.colOld}</div>
        <div className="border-b border-line bg-foreground p-5 font-semibold text-background">{t.colNew}</div>

        {rows.map((r, i) => (
          <div key={r.label} className="contents">
            <div
              className={`col-span-2 px-5 pb-1 pt-4 font-medium sm:col-span-1 sm:py-5 ${
                i < rows.length - 1 ? "sm:border-b sm:border-line" : ""
              }`}
            >
              {r.label}
            </div>
            <div
              className={`px-5 pb-4 pt-1 text-muted sm:py-5 ${i < rows.length - 1 ? "border-b border-line" : ""}`}
            >
              {r.old}
            </div>
            <div
              className={`bg-surface-2 px-5 pb-4 pt-1 sm:py-5 ${i < rows.length - 1 ? "border-b border-line" : ""}`}
            >
              <span className="me-1.5">✓</span>
              {r.wallify}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
