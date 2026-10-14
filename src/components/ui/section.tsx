import type { ReactNode } from "react";
import { cn, pad } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

interface SectionProps {
  /** Mono index, e.g. 3 renders "03". */
  index?: number;
  /** Short mono category, e.g. "Section". */
  kicker?: string;
  title: string;
  /** Intro paragraph under the title. */
  intro?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  /** Tighter vertical rhythm for nested blocks. */
  density?: "default" | "compact";
  /** Renders a full-bleed hairline above the section. */
  ruled?: boolean;
}

/**
 * The standard instrument-panel section: numbered mono label, display-serif
 * heading, hairline rules, and a consistent max width.
 */
export function Section({
  index,
  kicker = "Section",
  title,
  intro,
  children,
  id,
  className,
  density = "default",
  ruled = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        ruled && "border-t border-rule",
        density === "default" ? "py-16 sm:py-20 lg:py-24" : "py-10 sm:py-12",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {typeof index === "number" && (
              <span className="mono-label text-accent tabular">
                {pad(index)}
              </span>
            )}
            <span className="mono-label">{kicker}</span>
            <span
              aria-hidden
              className="hidden h-px flex-1 bg-[var(--rule)] sm:block"
            />
          </div>
          <h2 className="mt-4 max-w-3xl font-display text-display-lg leading-[1.05] tracking-[-0.02em]">
            {title}
          </h2>
          {intro && (
            <div className="mt-5 max-w-2xl text-[0.975rem] leading-relaxed text-muted sm:text-base">
              {intro}
            </div>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

interface SubHeadingProps {
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}

/** Small mono sub-heading used inside sections and detail pages. */
export function SubHeading({ children, hint, className }: SubHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <h3 className="mono-label text-foreground">{children}</h3>
      {hint && <span className="text-xs text-muted-2">{hint}</span>}
    </div>
  );
}
