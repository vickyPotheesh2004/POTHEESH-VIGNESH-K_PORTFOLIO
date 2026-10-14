import { buildLattice, projectTo2D } from "@/lib/lattice";

const SIZE = 520;
const SCALE = 96;

/**
 * Static fallback: a technical line drawing of the exact same lattice the
 * WebGL canvas renders. Used when WebGL is unavailable or the visitor has
 * requested reduced motion — never a blank box, and never a different object.
 */
export function LatticeFallback() {
  const { nodes, edges } = buildLattice();
  const centre = SIZE / 2;

  const projected = nodes.map((node) => {
    const { x, y, depth } = projectTo2D(node.position, SCALE);
    return {
      x: centre + x,
      y: centre + y,
      // Nearer nodes read slightly larger; farther nodes fade back.
      scale: 1 + depth * 0.1,
      signal: node.signal,
      intensity: node.intensity,
      depth,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full"
      role="img"
      aria-label="A three-dimensional lattice of connected nodes representing networked AI systems."
    >
      <g stroke="var(--accent)" strokeWidth="0.75">
        {edges.map(([a, b], i) => {
          const from = projected[a];
          const to = projected[b];
          if (!from || !to) return null;
          return (
            <line
              key={`e-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              opacity={0.13 + (1 - (from.depth + to.depth) / 6) * 0.1}
            />
          );
        })}
      </g>

      <g>
        {projected.map((node, i) =>
          node.signal ? (
            <circle
              key={`n-${i}`}
              cx={node.x}
              cy={node.y}
              r={2.6 * node.scale}
              fill="var(--signal)"
              opacity={0.95}
            />
          ) : (
            <circle
              key={`n-${i}`}
              cx={node.x}
              cy={node.y}
              r={1.5 * node.scale}
              fill="var(--accent)"
              opacity={0.4 + node.intensity * 0.5}
            />
          ),
        )}
      </g>

      {/* Outer cage, matching the WebGL gimbal. */}
      <circle
        cx={centre}
        cy={centre}
        r={SCALE * 3.05 * 0.72}
        fill="none"
        stroke="var(--violet)"
        strokeWidth="0.6"
        opacity="0.14"
      />
      <circle
        cx={centre}
        cy={centre}
        r={SCALE * 3.05 * 0.72}
        fill="none"
        stroke="var(--violet)"
        strokeWidth="0.6"
        opacity="0.09"
        transform={`rotate(62 ${centre} ${centre}) scale(1 0.34)`}
      />
    </svg>
  );
}
