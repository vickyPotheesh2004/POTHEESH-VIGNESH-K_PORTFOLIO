import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "signal";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 font-medium tracking-[-0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-[color:var(--background)] hover:bg-accent-strong border border-transparent",
  signal:
    "bg-signal text-[color:var(--background)] hover:brightness-110 border border-transparent",
  outline:
    "border border-border-strong text-foreground hover:border-accent hover:text-accent bg-transparent",
  ghost: "border border-transparent text-muted hover:text-accent",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-[0.8125rem]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-[0.9375rem]",
};

interface ActionProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  /** Icon shown on the trailing edge. */
  trailing?: ReactNode;
  "aria-label"?: string;
}

/**
 * The only button shape on the site. Internal routes use next/link, external
 * URLs use a real anchor with rel protection — every destination is real.
 */
export function Action({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
  trailing,
  ...rest
}: ActionProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={rest["aria-label"]}
      >
        {children}
        {trailing ?? (
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
          />
        )}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={rest["aria-label"]}>
      {children}
      {trailing}
    </Link>
  );
}

/** Non-interactive chip used for technologies, tags and status labels. */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "signal" | "violet" | "positive" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "border-border text-muted",
    accent: "border-accent/40 text-accent bg-accent-soft",
    signal: "border-signal/40 text-signal bg-signal-soft",
    violet: "border-violet/40 text-violet bg-violet-soft",
    positive: "border-positive/40 text-positive",
    danger: "border-danger/40 text-danger",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-mono text-[0.6875rem] leading-none tracking-[0.04em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
