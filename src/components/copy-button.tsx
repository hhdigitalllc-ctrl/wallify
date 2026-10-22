"use client";

import { useState } from "react";

export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the user can still select the text manually.
    }
  }

  return (
    <button type="button" onClick={copy} className="btn-ghost btn-sm">
      {copied ? copiedLabel : label}
    </button>
  );
}
