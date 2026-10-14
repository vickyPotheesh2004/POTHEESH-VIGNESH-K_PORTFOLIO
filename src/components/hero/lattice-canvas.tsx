"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildLattice } from "@/lib/lattice";

/* Instrument palette, mirroring the CSS custom properties. Reading them from
   CSS at runtime would force a layout read every frame; these are constants. */
const CYAN = new THREE.Color("#4fd1e0");
const AMBER = new THREE.Color("#f0a93b");
const VIOLET = new THREE.Color("#9b8cf8");

const REDUCED = { x: 0, y: 0 };

interface LatticeProps {
  pointer: React.RefObject<{ x: number; y: number }>;
}

function Lattice({ pointer }: LatticeProps) {
  const group = useRef<THREE.Group>(null);
  const cage = useRef<THREE.LineSegments>(null);

  const { nodeGeometry, edgeGeometry, signalGeometry } = useMemo(() => {
    const { nodes, edges } = buildLattice();

    /* ---- nodes: one point cloud, coloured per vertex ------------------ */
    const positions = new Float32Array(nodes.length * 3);
    const colors = new Float32Array(nodes.length * 3);

    nodes.forEach((node, i) => {
      positions.set(node.position, i * 3);
      const base = node.signal ? AMBER : CYAN;
      const c = base.clone().multiplyScalar(node.intensity);
      colors.set([c.r, c.g, c.b], i * 3);
    });

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    nodeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    /* ---- signal nodes drawn larger, in their own cloud ---------------- */
    const signalPositions: number[] = [];
    nodes.forEach((node) => {
      if (node.signal) signalPositions.push(...node.position);
    });
    const signalGeometry = new THREE.BufferGeometry();
    signalGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(signalPositions), 3),
    );

    /* ---- filaments ---------------------------------------------------- */
    const edgePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      const from = nodes[a];
      const to = nodes[b];
      if (!from || !to) return;
      edgePositions.set(from.position, i * 6);
      edgePositions.set(to.position, i * 6 + 3);
    });

    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(edgePositions, 3),
    );

    return { nodeGeometry, edgeGeometry, signalGeometry };
  }, []);

  /* Dispose GPU resources when the canvas unmounts. */
  useEffect(() => {
    return () => {
      nodeGeometry.dispose();
      edgeGeometry.dispose();
      signalGeometry.dispose();
    };
  }, [nodeGeometry, edgeGeometry, signalGeometry]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const target = pointer.current ?? REDUCED;

    if (group.current) {
      // Slow orbital drift plus a parallax lean toward the pointer.
      group.current.rotation.y += delta * 0.085;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        target.y * 0.22 + Math.sin(t * 0.22) * 0.05,
        0.045,
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        -target.x * 0.08,
        0.045,
      );

      // Barely-there breathing so the object never reads as a static image.
      const breath = 1 + Math.sin(t * 0.42) * 0.014;
      group.current.scale.setScalar(breath);
    }

    if (cage.current) {
      cage.current.rotation.y -= delta * 0.052;
      cage.current.rotation.x += delta * 0.017;
    }
  });

  return (
    <group ref={group}>
      <points geometry={nodeGeometry}>
        <pointsMaterial
          vertexColors
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.96}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points geometry={signalGeometry}>
        <pointsMaterial
          color={AMBER}
          size={0.105}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={0.17}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Gimbal cage — the "instrument" frame around the lattice. */}
      <lineSegments ref={cage}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(3.05, 1)]} />
        <lineBasicMaterial
          color={VIOLET}
          transparent
          opacity={0.11}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

interface LatticeCanvasProps {
  /** Paused when the hero scrolls out of view. */
  active: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
}

/**
 * The WebGL hero. Loaded lazily and never server-rendered, so Three.js stays
 * out of the initial page bundle and there is no SSR canvas mismatch.
 */
export default function LatticeCanvas({ active, pointer }: LatticeCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Lattice pointer={pointer} />
    </Canvas>
  );
}
