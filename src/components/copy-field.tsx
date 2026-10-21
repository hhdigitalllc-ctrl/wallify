"use client";

import { useState } from "react";

type Props = {
  label: string;
  hint?: string;
  value: string;
  /** Optional extra actions rendered after the copy button */
  actions?: { label: string; href: string; external?: boolean }[];
};

// A read-only value (link or code) with a copy button and optional shortcut links.
export function CopyField({ label, hint, value, actions = [] }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the value is selectable in the field.
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className="input min-w-0 flex-1 font-mono text-xs"
          aria-label={label}
        />
        <button type="button" onClick={copy} className="btn-primary btn-sm shrink-0">
          {copied ? "✓ Copied" : "Copy"}
        </button>
        {actions.map((a) => (
          <a
            key={a.label}
            href={a.href}
            {...(a.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="btn-ghost btn-sm shrink-0"
          >
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}
