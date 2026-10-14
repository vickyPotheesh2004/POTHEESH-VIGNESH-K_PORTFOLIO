import { ImageResponse } from "next/og";
import { PROJECT_STATS } from "@/data/projects";
import { SITE } from "@/data/site";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#060a12";
const CYAN = "#4fd1e0";
const AMBER = "#f0a93b";
const TEXT = "#e9eff9";
const MUTED = "#94a5c0";

/**
 * Open Graph / Twitter card, generated at build time. Typographic and
 * structural rather than photographic, so it stays legible as a small
 * thumbnail in a link preview.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: TEXT,
          padding: "62px 68px",
          position: "relative",
        }}
      >
        {/* Accent bars — the amber/cyan instrument signature. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            display: "flex",
            background: `linear-gradient(90deg, ${CYAN} 0%, ${CYAN} 62%, ${AMBER} 62%, ${AMBER} 100%)`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              color: CYAN,
              textTransform: "uppercase",
            }}
          >
            Aspiring AI/ML Engineer · Solo AI Researcher
          </div>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.02,
              letterSpacing: -2.5,
              maxWidth: 900,
            }}
          >
            Potheesh Vignesh K
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            maxWidth: 940,
          }}
        >
          <div style={{ fontSize: 30, lineHeight: 1.3, color: "#c5d1e3" }}>
            Local-first retrieval, multi-agent reasoning and deterministic
            verification — with every figure labelled verified or
            self-reported.
          </div>

          <div style={{ display: "flex", gap: 46, alignItems: "flex-end" }}>
            {[
              { value: String(PROJECT_STATS.total), label: "Projects" },
              { value: String(PROJECT_STATS.publishedPackages), label: "PyPI packages" },
              { value: "2", label: "IEEE papers" },
              { value: "2", label: "AI internships" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div style={{ fontSize: 40, color: AMBER, letterSpacing: -1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 18, color: MUTED }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid #1c2942`,
            paddingTop: 22,
            fontSize: 20,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>github.com/vickyPotheesh2004</div>
          <div style={{ display: "flex", color: CYAN }}>
            potheesh-vignesh-portfolio.vercel.app
          </div>
        </div>
      </div>
    ),
    size,
  );
}
