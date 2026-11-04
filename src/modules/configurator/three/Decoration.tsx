"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import type { PlacedDecoration } from "@/lib/types";
import { assetById, useDesign } from "../design-store";

interface Props {
  d: PlacedDecoration;
  index: number;
  surfaceRef: React.RefObject<THREE.Group | null>;
}

const _plane = new THREE.Plane();
const _normal = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _hit = new THREE.Vector3();

/**
 * Recurso 2D (SVG/PNG transparente) colocado sobre una superficie del sello.
 * Es una lámina plana con textura: no simula volumen 3D.
 * Se arrastra dentro de los límites de la superficie; su tamaño es fijo.
 */
export function Decoration({ d, index, surfaceRef }: Props) {
  const asset = assetById(d.assetId)!;
  const tex = useTexture(asset.src);
  const gl = useThree((s) => s.gl);
  const controls = useThree((s) => s.controls) as unknown as { enabled: boolean } | null;
  const selected = useDesign((s) => s.selected === d.uid);
  const select = useDesign((s) => s.select);
  const begin = useDesign((s) => s.begin);
  const commit = useDesign((s) => s.commit);
  const move = useDesign((s) => s.move);
  const drag = useRef<{ id: number; ox: number; oy: number } | null>(null);

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    tex.needsUpdate = true;
  }, [tex, gl]);

  const isFigure = d.kind === "figura";
  const w = asset.widthCm;
  const h = asset.heightCm;
  // Separación mínima de la superficie y entre elementos para evitar parpadeo.
  const z = (isFigure ? 0.03 : 0.006) + index * 0.002;

  const localPoint = (e: ThreeEvent<PointerEvent>) => {
    const g = surfaceRef.current;
    if (!g) return null;
    g.updateWorldMatrix(true, false);
    _normal.set(0, 0, 1).transformDirection(g.matrixWorld);
    g.getWorldPosition(_origin);
    _plane.setFromNormalAndCoplanarPoint(_normal, _origin);
    if (!e.ray.intersectPlane(_plane, _hit)) return null;
    return g.worldToLocal(_hit.clone());
  };

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    select(d.uid);
    const p = localPoint(e);
    if (!p) return;
    drag.current = { id: e.pointerId, ox: p.x - d.x, oy: p.y - d.y };
    begin();
    (e.target as unknown as Element).setPointerCapture?.(e.pointerId);
    if (controls) controls.enabled = false;
    document.body.style.cursor = "grabbing";
  };

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    e.stopPropagation();
    const p = localPoint(e);
    if (p) move(d.uid, p.x - drag.current.ox, p.y - drag.current.oy);
  };

  const end = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    drag.current = null;
    (e.target as unknown as Element).releasePointerCapture?.(e.pointerId);
    if (controls) controls.enabled = true;
    document.body.style.cursor = "";
    commit();
  };

  const outline = useMemo(() => {
    const pw = w / 2 + 0.12;
    const ph = h / 2 + 0.12;
    return [
      [-pw, -ph, 0], [pw, -ph, 0], [pw, ph, 0], [-pw, ph, 0], [-pw, -ph, 0],
    ] as [number, number, number][];
  }, [w, h]);

  return (
    <group position={[d.x, d.y, z]} rotation={[0, 0, (d.rotation * Math.PI) / 180]}>
      {isFigure && (
        // Sombra de contacto suave bajo la figura de goma.
        <mesh position={[0.05, -0.07, -z + 0.004]} renderOrder={1}>
          <planeGeometry args={[w * 1.02, h * 1.02]} />
          <meshBasicMaterial map={tex} color="#000" transparent opacity={0.28} depthWrite={false} alphaTest={0.05} />
        </mesh>
      )}
      <mesh
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerOver={() => (document.body.style.cursor = drag.current ? "grabbing" : "grab")}
        onPointerOut={() => !drag.current && (document.body.style.cursor = "")}
        renderOrder={2}
      >
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          map={tex}
          transparent
          alphaTest={0.45}
          roughness={isFigure ? 0.32 : 0.55}
          clearcoat={isFigure ? 0.8 : 0.2}
          clearcoatRoughness={0.25}
          side={THREE.FrontSide}
        />
      </mesh>
      {selected && (
        <Line points={outline} color="#ffffff" lineWidth={1.6} dashed dashSize={0.14} gapSize={0.09} transparent opacity={0.95} position={[0, 0, 0.01]} />
      )}
    </group>
  );
}
