"use client";

import { useActionState, useState } from "react";
import { submitTestimonial } from "@/app/collect/[slug]/actions";

export function CollectForm({ spaceId }: { spaceId: string }) {
  const [state, formAction, pending] = useActionState(submitTestimonial, undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state?.done) {
    return (
      <div className="py-10 text-center">
        <div className="mb-3 text-4xl">🎉</div>
        <h2 className="text-xl font-semibold">Thank you!</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Your testimonial means a lot. It will show up once it has been approved.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

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

      <div role="radiogroup" aria-label="Rating" className="flex gap-1">
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
            className={`text-3xl leading-none ${
              n <= (hover || rating) ? "text-amber-400" : "text-neutral-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        name="content"
        rows={5}
        maxLength={1000}
        required
        placeholder="What did you like?"
        className={input}
      />
      <input name="client_name" required maxLength={80} placeholder="Your name" className={input} />
      <input
        name="client_title"
        maxLength={80}
        placeholder="Title / Company (optional)"
        className={input}
      />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send testimonial"}
      </button>
    </form>
  );
}
