"use client";

import { useActionState, useEffect, useRef } from "react";
import { createSpace } from "@/app/dashboard/actions";

export function CreateSpaceForm() {
  const [state, formAction, pending] = useActionState(createSpace, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the inputs after a successful create (no error returned).
  useEffect(() => {
    if (!pending && state === undefined) formRef.current?.reset();
  }, [pending, state]);

  const input =
    "rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

  return (
    <form ref={formRef} action={formAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <input name="name" placeholder="Space name, e.g. Mood Print" required className={input} />
      <input name="headline" placeholder="Headline: Send us some love!" className={input} />
      <button
        disabled={pending}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create space"}
      </button>
      {state?.error && <p className="text-sm text-red-600 sm:col-span-3">{state.error}</p>}
    </form>
  );
}
