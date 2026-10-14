"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, Phone, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { CONTACT, NAV, SITE } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { Action } from "@/components/ui/action";
import { cn } from "@/lib/utils";

/** The subset that fits comfortably on a desktop bar. All eight live in the menu. */
const DESKTOP_NAV = NAV.filter((item) =>
  ["Experience", "Projects", "Research", "Services"].includes(item.label),
);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /**
   * Close the menu when the route changes. Done during render rather than in
   * an effect — React's documented pattern for adjusting state in response to
   * a changed value, and it avoids an extra render pass.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  /* Header gains a surface once the page has scrolled. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Escape closes; focus is trapped while open and restored on close. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /* Captured now: the ref may point elsewhere by cleanup time. */
    const trigger = triggerRef.current;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) => {
      const target = href.split("#")[0] ?? href;
      if (target === "/" || target === "") return false;
      return pathname === target || pathname.startsWith(`${target}/`);
    },
    [pathname],
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${SITE.name} — home`}
        >
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center border border-border-strong bg-surface-2 font-mono text-[0.7rem] font-medium tracking-tight text-accent transition-colors group-hover:border-accent"
          >
            PVK
          </span>
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-[0.9rem] font-medium tracking-[-0.01em]">
              {SITE.shortName}
            </span>
            <span className="mono-label truncate text-[0.625rem]">
              AI/ML Engineer
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-1 lg:flex"
        >
          {DESKTOP_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-3 py-2 text-[0.875rem] transition-colors",
                isActive(item.href)
                  ? "text-accent"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <ThemeToggle />
          <Action href="/contact" size="sm" className="hidden sm:inline-flex">
            Hire me
          </Action>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 shrink-0 place-items-center border border-border bg-surface-2 text-foreground-soft transition-colors hover:border-border-strong lg:hidden"
          >
            {open ? (
              <X aria-hidden className="size-4" />
            ) : (
              <Menu aria-hidden className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Scroll position indicator — literal progress along the page. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-opacity duration-300"
        style={{
          transform: `scaleX(${progress})`,
          opacity: scrolled ? 0.7 : 0,
        }}
      />

      {/* ---------------------------------------------------------- menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-border bg-background lg:hidden"
      >
        <div className="mx-auto w-full max-w-6xl px-5 pb-8 pt-4 sm:px-8">
          <nav aria-label="All sections" className="grid gap-px">
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline justify-between gap-4 border-b border-border py-3 transition-colors hover:text-accent"
              >
                <span className="flex items-baseline gap-3">
                  <span className="mono-label tabular text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem] font-medium">
                    {item.label}
                  </span>
                </span>
                {item.hint && (
                  <span className="hidden max-w-[16rem] text-right text-xs text-muted-2 sm:block">
                    {item.hint}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-3">
              <ThemeToggle variant="menu" />
            </div>
          </nav>

          <div className="mt-6 grid gap-2">
            <Action href="/contact" size="lg" className="w-full">
              Discuss an AI project
            </Action>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 border border-border px-4 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <Mail aria-hidden className="size-4 shrink-0" />
                <span className="truncate">{CONTACT.email}</span>
              </a>
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="flex items-center gap-3 border border-border px-4 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <Phone aria-hidden className="size-4 shrink-0" />
                <span>{CONTACT.phone}</span>
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-border px-4 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <GithubIcon className="size-4 shrink-0" />
                <span>GitHub</span>
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-border px-4 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                <LinkedinIcon className="size-4 shrink-0" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
