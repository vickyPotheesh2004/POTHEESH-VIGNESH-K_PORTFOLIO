/**
 * Geometry for the hero object: a machined lattice of nodes and filaments.
 *
 * Kept as pure functions with a seeded PRNG so the object is identical on every
 * render, identical between the WebGL canvas and the SVG fallback, and
 * straightforward to unit test. No Three.js types leak in here.
 */

export type Vec3 = [number, number, number];

export interface LatticeNode {
  position: Vec3;
  /** Signal nodes are rendered in the amber instrument accent. */
  signal: boolean;
  /** Per-node brightness variation so the surface is not uniform. */
  intensity: number;
}

export interface Lattice {
  nodes: LatticeNode[];
  /** Pairs of node indices. */
  edges: [number, number][];
}

/** Deterministic 32-bit PRNG (mulberry32). Same seed → same lattice, always. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Evenly distributed points on a sphere using the golden-angle spiral.
 * Far more uniform than random sampling, with no polar clustering.
 */
export function fibonacciSphere(count: number, radius: number): Vec3[] {
  if (count <= 0) return [];
  if (count === 1) return [[0, 0, radius]];

  const points: Vec3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push([
      Math.cos(theta) * ringRadius * radius,
      y * radius,
      Math.sin(theta) * ringRadius * radius,
    ]);
  }

  return points;
}

export interface LatticeOptions {
  count?: number;
  radius?: number;
  /** Random displacement applied to each node, as a fraction of the radius. */
  jitter?: number;
  /** Maximum distance at which two nodes are joined by a filament. */
  edgeDistance?: number;
  /** Cap on connections per node, keeping the lattice legible. */
  maxDegree?: number;
  /** Fraction of nodes marked as signal nodes. */
  signalRatio?: number;
  seed?: number;
}

/**
 * Builds the hero lattice. Edge selection is nearest-neighbour with a degree
 * cap, which reads as a deliberate structure rather than a random hairball.
 */
export function buildLattice({
  count = 168,
  radius = 2,
  jitter = 0.14,
  edgeDistance = 0.66,
  maxDegree = 3,
  signalRatio = 0.12,
  seed = 20260414,
}: LatticeOptions = {}): Lattice {
  const random = mulberry32(seed);
  const base = fibonacciSphere(count, radius);

  const nodes: LatticeNode[] = base.map(([x, y, z]) => {
    const amount = jitter * radius;
    const position: Vec3 = [
      x + (random() * 2 - 1) * amount,
      y + (random() * 2 - 1) * amount,
      z + (random() * 2 - 1) * amount,
    ];
    // Spread the signal nodes through the shell rather than clustering them.
    const signal = random() < signalRatio;
    const intensity = 0.55 + random() * 0.45;
    return {
      position,
      signal,
      // Signal nodes read brighter so they stand out against the lattice.
      intensity: signal ? Math.min(1, intensity + 0.25) : intensity,
    };
  });

  const maxDistanceSq = edgeDistance * edgeDistance;
  const candidates: { a: number; b: number; d: number }[] = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    if (!a) continue;
    for (let j = i + 1; j < nodes.length; j += 1) {
      const b = nodes[j];
      if (!b) continue;
      const dx = a.position[0] - b.position[0];
      const dy = a.position[1] - b.position[1];
      const dz = a.position[2] - b.position[2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d <= maxDistanceSq) candidates.push({ a: i, b: j, d });
    }
  }

  // Shortest filaments first, then enforce the per-node degree cap.
  candidates.sort((x, y) => x.d - y.d);

  const degree = new Array<number>(nodes.length).fill(0);
  const edges: [number, number][] = [];

  for (const { a, b } of candidates) {
    const da = degree[a] ?? 0;
    const db = degree[b] ?? 0;
    if (da >= maxDegree || db >= maxDegree) continue;
    degree[a] = da + 1;
    degree[b] = db + 1;
    edges.push([a, b]);
  }

  return { nodes, edges };
}

/**
 * Orthographic projection used by the SVG fallback so it depicts the *same*
 * lattice the WebGL canvas would have drawn, rather than a different drawing.
 */
export function projectTo2D(
  position: Vec3,
  scale: number,
): { x: number; y: number; depth: number } {
  const [x, y, z] = position;
  return { x: x * scale, y: -y * scale, depth: z };
}
