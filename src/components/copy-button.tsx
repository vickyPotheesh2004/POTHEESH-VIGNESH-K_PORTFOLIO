"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

/**
 * Copies a value to the clipboard and reports the outcome honestly.
 *
 * If the clipboard API is unavailable or blocked (it is on some non-secure
 * origins) the button says so rather than claiming a success that did not
 * happen.
 */
export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error("unavailable");
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 border border-border px-2.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent",
        state === "copied" && "border-positive text-positive",
        state === "failed" && "border-danger text-danger",
        className,
      )}
    >
      {state === "copied" ? (
        <Check aria-hidden className="size-3" />
      ) : (
        <Copy aria-hidden className="size-3" />
      )}
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label}
    </button>
  );
}
