"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/components/theme-script";

function currentTheme(): "dark" | "light" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function applyTheme(theme: "dark" | "light") {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

interface ThemeToggleProps {
  /** Larger hit area and a visible label, for the mobile menu. */
  variant?: "icon" | "menu";
}

/**
 * Both icons are always rendered and swapped by CSS on the `data-theme`
 * attribute, so the server and client markup agree on first render and the
 * button has no dependence on React state to look correct.
 */
export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  // Follow live OS changes, but only while the visitor has not chosen a theme.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        stored = null;
      }
      if (stored === "dark" || stored === "light") return;
      applyTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Storage can be blocked; the theme still applies for this page view. */
    }
  }

  const label = "Switch between light and dark theme";

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className="flex w-full items-center justify-between gap-4 border border-border bg-surface-2 px-4 py-3 text-left text-sm transition-colors hover:border-border-strong"
      >
        <span className="flex items-center gap-3">
          <Sun aria-hidden className="hidden size-4 text-signal dark:block" />
          <Moon aria-hidden className="block size-4 text-accent dark:hidden" />
          <span className="font-medium">Theme</span>
        </span>
        <span className="mono-label">
          <span className="hidden dark:inline">Dark</span>
          <span className="inline dark:hidden">Light</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="relative grid size-9 shrink-0 place-items-center border border-border bg-surface-2 text-foreground-soft transition-colors hover:border-border-strong hover:text-foreground"
    >
      <Sun aria-hidden className="hidden size-4 text-signal dark:block" />
      <Moon aria-hidden className="block size-4 text-accent dark:hidden" />
    </button>
  );
}
