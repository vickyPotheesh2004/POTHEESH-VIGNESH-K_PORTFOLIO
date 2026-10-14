import { describe, expect, it } from "vitest";
import { buildLattice, fibonacciSphere, mulberry32, projectTo2D } from "./lattice";

describe("mulberry32", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(1234);
    const b = mulberry32(1234);
    const first = Array.from({ length: 20 }, () => a());
    const second = Array.from({ length: 20 }, () => b());
    expect(first).toEqual(second);
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });

  it("stays within [0, 1)", () => {
    const random = mulberry32(99);
    for (let i = 0; i < 500; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("fibonacciSphere", () => {
  it("returns the requested number of points", () => {
    expect(fibonacciSphere(0, 1)).toHaveLength(0);
    expect(fibonacciSphere(1, 2)).toHaveLength(1);
    expect(fibonacciSphere(64, 1)).toHaveLength(64);
  });

  it("places every point on the sphere of the given radius", () => {
    const radius = 2.5;
    for (const [x, y, z] of fibonacciSphere(120, radius)) {
      const distance = Math.sqrt(x * x + y * y + z * z);
      expect(distance).toBeCloseTo(radius, 6);
    }
  });

  it("covers the sphere without polar clustering", () => {
    const points = fibonacciSphere(100, 1);
    const north = points.filter(([, y]) => y > 0.9).length;
    const equator = points.filter(([, y]) => Math.abs(y) <= 0.1).length;
    // An evenly distributed set has roughly the same count in both bands.
    expect(north).toBeLessThan(equator + 6);
    expect(north).toBeGreaterThan(0);
  });
});

describe("buildLattice", () => {
  it("is deterministic for a given seed", () => {
    const a = buildLattice({ seed: 7 });
    const b = buildLattice({ seed: 7 });
    expect(a.nodes).toEqual(b.nodes);
    expect(a.edges).toEqual(b.edges);
  });

  it("changes when the seed changes", () => {
    const a = buildLattice({ seed: 7 });
    const b = buildLattice({ seed: 8 });
    expect(a.nodes).not.toEqual(b.nodes);
  });

  it("respects the node count", () => {
    expect(buildLattice({ count: 40 }).nodes).toHaveLength(40);
  });

  it("never exceeds the per-node degree cap", () => {
    const maxDegree = 3;
    const { nodes, edges } = buildLattice({ count: 120, maxDegree });
    const degree = new Array<number>(nodes.length).fill(0);
    for (const [a, b] of edges) {
      degree[a] = (degree[a] ?? 0) + 1;
      degree[b] = (degree[b] ?? 0) + 1;
    }
    expect(Math.max(...degree)).toBeLessThanOrEqual(maxDegree);
  });

  it("keeps the filament count bounded and legible", () => {
    const { nodes, edges } = buildLattice({ count: 168, maxDegree: 3 });
    // With a degree cap of 3 the theoretical maximum is 3n/2.
    expect(edges.length).toBeLessThanOrEqual(Math.floor((nodes.length * 3) / 2));
    expect(edges.length).toBeGreaterThan(0);
  });

  it("only joins distinct, in-range node indices", () => {
    const { nodes, edges } = buildLattice({ count: 60 });
    for (const [a, b] of edges) {
      expect(a).not.toBe(b);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(nodes.length);
    }
  });

  it("marks a plausible share of signal nodes", () => {
    const { nodes } = buildLattice({ count: 200, signalRatio: 0.12, seed: 5 });
    const signals = nodes.filter((node) => node.signal).length;
    expect(signals).toBeGreaterThan(0);
    expect(signals).toBeLessThan(nodes.length / 2);
  });

  it("keeps node brightness within range and lifts signal nodes", () => {
    const { nodes } = buildLattice({ count: 150, seed: 11 });
    const plain = nodes.filter((node) => !node.signal);
    const signals = nodes.filter((node) => node.signal);
    for (const node of nodes) {
      expect(node.intensity).toBeGreaterThan(0);
      expect(node.intensity).toBeLessThanOrEqual(1);
    }
    if (plain.length > 0 && signals.length > 0) {
      const mean = (list: typeof nodes) =>
        list.reduce((sum, node) => sum + node.intensity, 0) / list.length;
      expect(mean(signals)).toBeGreaterThan(mean(plain));
    }
  });
});

describe("projectTo2D", () => {
  it("maps y to screen space and preserves depth", () => {
    expect(projectTo2D([1, 1, 1], 10)).toEqual({ x: 10, y: -10, depth: 1 });
  });
});
