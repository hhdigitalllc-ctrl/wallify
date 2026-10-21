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

  return (
    <form ref={formRef} action={formAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <input name="name" placeholder="Space name, e.g. Mood Print" required className="input" />
      <input name="headline" placeholder="Headline: Send us some love!" className="input" />
      <button disabled={pending} className="btn-primary">
        {pending ? "Creating…" : "Create space"}
      </button>
      {state?.error && <p className="text-sm text-danger sm:col-span-3">{state.error}</p>}
    </form>
  );
}
