import type { ReactNode } from "react";
import { cn, pad } from "@/lib/utils";

interface BlockProps {
  /** Sequential index within the page; renders as a mono "07". */
  index: number;
  title: string;
  /** Short mono annotation shown beside the title. */
  hint?: string;
  children: ReactNode;
  className?: string;
}

/**
 * One numbered content block on a project detail page. The numbering is the
 * point: readers can refer to "block 11" in a conversation about a build, and
 * the same order holds on every project.
 */
export function Block({ index, title, hint, children, className }: BlockProps) {
  return (
    <section className={cn("scroll-mt-28 border-t border-rule pt-8", className)}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="mono-label tabular text-accent">{pad(index)}</span>
        <h2 className="font-display text-display-sm leading-tight tracking-[-0.015em]">
          {title}
        </h2>
        {hint && <span className="mono-label ml-auto">{hint}</span>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Bulleted list with a hairline diamond marker, used inside blocks. */
export function BulletList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
          <span
            aria-hidden
            className="mt-1.5 size-1.5 shrink-0 rotate-45 border border-accent"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
