"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="rounded-md border-2 border-ink bg-card px-2 py-0.5 text-xs font-bold text-ink transition-colors hover:bg-ink hover:text-card"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      type="button"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
