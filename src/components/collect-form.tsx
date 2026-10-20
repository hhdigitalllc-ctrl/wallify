"use client";

import { useActionState, useState } from "react";
import { submitTestimonial } from "@/app/collect/[slug]/actions";

const labels = ["Poor", "Fair", "Good", "Great", "Loved it!"];

export function CollectForm({ spaceId }: { spaceId: string }) {
  const [state, formAction, pending] = useActionState(submitTestimonial, undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state?.done) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent">
          ♥
        </div>
        <h2 className="display text-3xl">Thank you!</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
          Your words mean a lot. They&apos;ll show up once they&apos;ve been approved.
        </p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="space_id" value={spaceId} />
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
        <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className={`text-4xl leading-none transition-transform hover:scale-110 ${
                n <= shown ? "text-amber-400" : "text-line"
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm text-muted">{shown ? labels[shown - 1] : ""}</span>
        </div>
      </div>

      <textarea
        name="content"
        rows={5}
        maxLength={1000}
        required
        placeholder="What did you like?"
        className="input resize-none"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="client_name" required maxLength={80} placeholder="Your name" className="input" />
        <input name="client_title" maxLength={80} placeholder="Title / Company (optional)" className="input" />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <button disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Sending…" : "Send testimonial"}
      </button>
    </form>
  );
}
