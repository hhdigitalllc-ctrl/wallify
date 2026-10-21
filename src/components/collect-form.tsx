"use client";

import { useActionState, useState } from "react";
import { submitTestimonial } from "@/app/[locale]/collect/[slug]/actions";
import Link from "next/link";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function CollectForm({ spaceId, locale }: { spaceId: string; locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.collect;
  const labels = t.ratingLabels;
  const [state, formAction, pending] = useActionState(submitTestimonial, undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state?.done) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent">
          ♥
        </div>
        <h2 className="display text-3xl">{t.thanks}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{t.thanksP}</p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="rating" value={rating} />
      {/* Honeypot, hidden from users and screen readers */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px]"
      />

      <div>
        <div role="radiogroup" aria-label={t.ratingAria} className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} ★`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className={`text-4xl leading-none transition-transform hover:scale-110 ${
                n <= shown ? "text-star" : "text-line"
              }`}
            >
              ★
            </button>
          ))}
          <span className="ms-2 text-sm text-muted">{shown ? labels[shown - 1] : ""}</span>
        </div>
      </div>

      <textarea
        name="content"
        rows={5}
        maxLength={1000}
        required
        placeholder={t.placeholderContent}
        className="input resize-none"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="client_name" required maxLength={80} placeholder={t.placeholderName} className="input" />
        <input name="client_title" maxLength={80} placeholder={t.placeholderTitle} className="input" />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <button disabled={pending} className="btn-primary w-full py-3">
        {pending ? t.sending : t.send}
      </button>

      <p className="text-center text-xs leading-relaxed text-muted">
        {t.consent}{" "}
        <Link href={href(locale, "/privacy")} target="_blank" className="underline underline-offset-2">
          {d.footer.privacy}
        </Link>
        .
      </p>
    </form>
  );
}
