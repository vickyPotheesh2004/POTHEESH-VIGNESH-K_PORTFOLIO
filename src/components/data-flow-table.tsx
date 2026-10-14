import { ArrowRight } from "lucide-react";
import type { DataFlowStep } from "@/data/projects";

/**
 * How data moves between stages: what goes in, where it goes, what travels.
 *
 * Rendered as a divided list rather than a table because a three-column table
 * forces horizontal scrolling on a phone, and this content is the part a
 * reader most needs to be able to read comfortably.
 */
export function DataFlowTable({ steps }: { steps: DataFlowStep[] }) {
  return (
    <ol className="grid gap-px overflow-hidden border border-border bg-[var(--rule)]">
      {steps.map((step, index) => (
        <li key={`${step.from}-${step.to}-${index}`} className="bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[0.75rem] leading-snug">
            <span className="text-foreground-soft">{step.from}</span>
            <ArrowRight aria-hidden className="size-3 shrink-0 text-accent" />
            <span className="text-accent">{step.to}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {step.payload}
          </p>
        </li>
      ))}
    </ol>
  );
}
