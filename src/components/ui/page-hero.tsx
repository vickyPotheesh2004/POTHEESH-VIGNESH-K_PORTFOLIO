import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  name: string;
  path: string;
}

interface PageHeroProps {
  kicker: string;
  title: string;
  intro?: ReactNode;
  /** Rendered between the intro and the trailing rule. */
  children?: ReactNode;
  crumbs?: Crumb[];
}

/**
 * The compact header used by every route other than the home page. Keeps the
 * instrument motif — mono kicker, hairline rule, display serif — while giving
 * each page exactly one <h1>.
 */
export function PageHero({
  kicker,
  title,
  intro,
  children,
  crumbs,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-60"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                  <li key={crumb.path} className="flex items-center gap-1.5">
                    {isLast ? (
                      <span
                        aria-current="page"
                        className="mono-label text-accent"
                      >
                        {crumb.name}
                      </span>
                    ) : (
                      <>
                        <Link
                          href={crumb.path}
                          className="mono-label transition-colors hover:text-accent"
                        >
                          {crumb.name}
                        </Link>
                        <ChevronRight
                          aria-hidden
                          className="size-3 text-muted-2"
                        />
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        <p className="mono-label text-accent">{kicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-display-lg leading-[1.03] tracking-[-0.025em]">
          {title}
        </h1>

        {intro && (
          <div className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
            {intro}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
