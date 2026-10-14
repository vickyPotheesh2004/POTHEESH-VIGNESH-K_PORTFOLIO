import Link from "next/link";
import { Action } from "@/components/ui/action";
import { NAV } from "@/data/site";

/**
 * Custom 404. Next.js sets the HTTP status to 404 for this page
 * automatically; it is not pre-rendered as a 200.
 */
export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mono-label text-accent">Error · 404</p>

        <h1 className="mt-5 font-display text-display-xl leading-[1.02] tracking-[-0.03em]">
          No such page
        </h1>

        <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
          The address you followed does not exist on this site. It may have been
          renamed, or the link that brought you here may be out of date.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Action href="/" size="lg">
            Back to the home page
          </Action>
          <Action href="/projects" size="lg" variant="outline">
            Browse the projects
          </Action>
          <Action href="/contact" size="lg" variant="outline">
            Report a broken link
          </Action>
        </div>

        <nav aria-label="Site sections" className="mt-14 border-t border-rule pt-8">
          <p className="mono-label">Every section</p>
          <ul className="mt-5 grid gap-px border border-border bg-[var(--rule)] sm:grid-cols-2">
            {NAV.map((item, index) => (
              <li key={item.href} className="bg-surface">
                <Link
                  href={item.href}
                  className="flex items-baseline gap-3 px-4 py-3 transition-colors hover:bg-surface-2 hover:text-accent"
                >
                  <span className="mono-label tabular text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.hint && (
                    <span className="ml-auto hidden text-xs text-muted-2 sm:block">
                      {item.hint}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
