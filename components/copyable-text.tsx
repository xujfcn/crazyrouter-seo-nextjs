"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyableTextProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyableText({ value, label = "Copy", className = "" }: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <span
      className={`inline-flex min-w-0 max-w-full items-center gap-2 rounded-md border border-line bg-white px-2 py-1 font-mono text-sm text-ink ${className}`}
    >
      <span className="truncate">{value}</span>
      <button
        type="button"
        onClick={copyValue}
        className="inline-flex h-6 w-6 flex-none items-center justify-center rounded border border-line text-muted hover:border-brand hover:text-ink"
        aria-label={label}
        title={label}
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      </button>
    </span>
  );
}
