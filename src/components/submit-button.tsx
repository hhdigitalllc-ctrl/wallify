"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
};

// Disables itself and shows a spinner while the parent <form> action runs.
export function SubmitButton({ children, className = "btn-primary", pendingText }: Props) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} aria-busy={pending} className={className}>
      {pending && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
