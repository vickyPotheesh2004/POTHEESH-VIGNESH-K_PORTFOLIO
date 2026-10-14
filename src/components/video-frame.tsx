"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoFrameProps {
  src: string;
  poster: string;
  /** Caption describing what the recording shows. */
  caption: string;
  /** Accessible description of the recording's content. */
  alt: string;
  /**
   * "confirmed"  → the recording's content matches the implementation.
   * "inferred"   → matched by filename and subject only; flagged to the reader.
   */
  confidence: "confirmed" | "inferred";
}

/**
 * Portrait screen recording presented in a device frame.
 *
 * The video element is not created until the visitor asks for it, so a card or
 * detail page never pulls megabytes of footage just to show a still. Every
 * recording on this site is 720×1280 portrait, which is why the frame is
 * 9:16 rather than the usual 16:9 embed.
 */
export function VideoFrame({
  src,
  poster,
  caption,
  alt,
  confidence,
}: VideoFrameProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="flex flex-col items-center">
      <div className="w-full max-w-[20rem] rounded-[var(--radius-lg)] border border-border-strong bg-[var(--background-deep)] p-2 shadow-[0_20px_50px_-30px_rgb(var(--shadow-color)/0.8)]">
        {/* Instrument status strip, echoing the site's mono labelling. */}
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="mono-label text-[0.5625rem]">Recording</span>
          <span className="mono-label text-[0.5625rem] tabular">
            720 × 1280 · H.264
          </span>
        </div>

        <div className="relative aspect-[9/16] overflow-hidden rounded-[var(--radius-sm)] bg-black">
          {playing ? (
            <video
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            >
              Your browser cannot play this video. The source is at {src}.
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play recording: ${alt}`}
              className="group relative block h-full w-full cursor-pointer"
            >
              <Image
                src={poster}
                alt={alt}
                width={540}
                height={960}
                sizes="(max-width: 640px) 80vw, 20rem"
                className="h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/25"
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-black/45 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105"
              >
                <Play className="ml-0.5 size-5 fill-white text-white" />
              </span>
              <span
                aria-hidden
                className="absolute inset-x-3 bottom-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-white/85"
              >
                Play
              </span>
            </button>
          )}
        </div>
      </div>

      <figcaption className="mt-4 max-w-[24rem] text-center text-sm leading-relaxed text-muted">
        {caption}
        {confidence === "inferred" && (
          <span className="mt-2 block border border-signal/40 bg-signal-soft px-2.5 py-2 text-left text-xs text-signal">
            Recording matched by filename and subject only. It has not been
            visually confirmed against this project&rsquo;s implementation and is
            flagged for review.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
