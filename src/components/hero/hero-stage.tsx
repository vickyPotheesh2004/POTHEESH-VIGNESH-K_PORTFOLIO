"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { LatticeFallback } from "@/components/hero/lattice-fallback";

/* Three.js is pulled in only when a real canvas is actually going to be used. */
const LatticeCanvas = dynamic(() => import("@/components/hero/lattice-canvas"), {
  ssr: false,
  loading: () => <StageChrome label="Preparing renderer" />,
});

/** Lightweight placeholder shown while the renderer boots. */
function StageChrome({ label }: { label: string }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <span className="mono-label text-muted-2">{label}</span>
    </div>
  );
}

type Mode = "pending" | "canvas" | "fallback";

/**
 * Browser capability is external, read-once state, so it is exposed through
 * useSyncExternalStore rather than an effect that sets state after mount.
 * The server snapshot is "pending", which is also what the first hydration
 * render uses — the real mode then arrives on the immediately following
 * render, with no hydration mismatch and no setState inside an effect.
 */
let cachedMode: Mode | null = null;

function readMode(): Mode {
  if (cachedMode === null) {
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") || canvas.getContext("webgl")),
      );
    } catch {
      webgl = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cachedMode = !reduced && webgl ? "canvas" : "fallback";
  }
  return cachedMode;
}

/** Capability never changes during a session, so there is nothing to watch. */
const subscribe = () => () => {};
const serverMode = (): Mode => "pending";

/**
 * Decides how to draw the hero object and manages its lifecycle:
 *  - falls back to SVG when WebGL is missing or motion is reduced
 *  - pauses the render loop while the hero is off-screen
 *  - tracks the pointer for parallax without re-rendering React
 */
export function HeroStage() {
  const mode = useSyncExternalStore(subscribe, readMode, serverMode);
  const [active, setActive] = useState(true);
  const wrapper = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  /* Pointer parallax, written to a ref so no React render happens per move. */
  useEffect(() => {
    if (mode !== "canvas") return;
    const onMove = (event: PointerEvent) => {
      const bounds = wrapper.current?.getBoundingClientRect();
      if (!bounds || bounds.width === 0) return;
      pointer.current = {
        x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  /* Stop rendering while the hero is scrolled past — no wasted GPU work. */
  useEffect(() => {
    const node = wrapper.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      className="relative aspect-square w-full max-w-[34rem] sm:max-w-[38rem] lg:max-w-none"
    >
      {/* Radial vignette so the lattice sits in space rather than on a flat page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 46%, color-mix(in oklab, var(--accent) 11%, transparent) 0%, transparent 62%)",
        }}
      />

      <div className="absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700">
        {mode === "canvas" && (
          <LatticeCanvas active={active} pointer={pointer} />
        )}
        {mode === "fallback" && <LatticeFallback />}
        {mode === "pending" && <StageChrome label="Initialising" />}
      </div>
    </div>
  );
}
