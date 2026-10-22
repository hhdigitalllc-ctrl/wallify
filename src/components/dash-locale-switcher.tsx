import { setLocale } from "@/app/dashboard/locale-actions";
import { localeNames, locales, type Locale } from "@/i18n/config";

export function DashLocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  return (
    <form action={setLocale} className="flex items-center rounded-lg border border-line bg-background p-0.5 text-xs" dir="ltr" aria-label={label}>
      {locales.map((l) => (
        <button
          key={l}
          name="locale"
          value={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          className={`flex-1 rounded-md px-2 py-1 font-medium transition ${
            l === locale ? "bg-foreground text-background" : "text-muted hover:text-foreground"
          }`}
        >
          {l === "ar" ? localeNames.ar : l.toUpperCase()}
        </button>
      ))}
    </form>
  );
}
