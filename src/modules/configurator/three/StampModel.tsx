"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Line, RoundedBox } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import type { SurfaceId } from "@/lib/types";
import { bodyH, bodyRadius, stampSpec, surfaces } from "@/lib/stamp-spec";
import { useDesign } from "../design-store";
import { useAdmin } from "@/modules/admin/admin-store";
import { Decoration } from "./Decoration";
import { fontFamilies } from "../PrintPreview";

/**
 * Modelo geométrico PROVISIONAL de un sello automático rectangular.
 * Unidades: cm. Origen en el centro del volumen total.
 * Cuando exista un GLB real (stampSpec.glbUrl), reemplazar el cuerpo por <primitive>
 * manteniendo las mismas superficies decorables (grupos `surface`).
 */
const W = stampSpec.width;
const H = stampSpec.height;
const D = stampSpec.depth;
const baseH = stampSpec.baseHeight;
const bodyY = -H / 2 + baseH + bodyH / 2;
const baseY = -H / 2 + baseH / 2;

const surfaceTransforms: Record<SurfaceId, { position: [number, number, number]; rotation: [number, number, number] }> = {
  frente: { position: [0, bodyY, D / 2 + 0.002], rotation: [0, 0, 0] },
  atras: { position: [0, bodyY, -D / 2 - 0.002], rotation: [0, Math.PI, 0] },
  arriba: { position: [0, H / 2 + 0.002, 0], rotation: [-Math.PI / 2, 0, 0] },
};

function useRubberTexture(lines: string[], font: keyof typeof fontFamilies) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = Math.round((1024 * (D - 0.7)) / (W - 0.6));
    return new THREE.CanvasTexture(c);
  }, []);
  useEffect(() => {
    const c = tex.image as HTMLCanvasElement;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#3a3a40";
    ctx.fillRect(0, 0, c.width, c.height);
    const varName = font === "sans" ? "--font-inter" : font === "serif" ? "--font-serif" : "--font-script";
    const family = getComputedStyle(document.documentElement).getPropertyValue(varName) || "sans-serif";
    const text = lines.map((l) => l.trim()).filter(Boolean);
    ctx.save();
    // Espejado: así se ve el caucho real desde abajo.
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = "#6b6b74";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const areaH = c.height * 0.62;
    const n = Math.max(1, text.length);
    text.forEach((t, i) => {
      let size = (areaH / n) * (i === 0 ? 0.9 : 0.75);
      ctx.font = `${i === 0 ? 600 : 400} ${size}px ${family}`;
      const wmax = c.width * 0.8;
      const m = ctx.measureText(t).width;
      if (m > wmax) {
        size *= wmax / m;
        ctx.font = `${i === 0 ? 600 : 400} ${size}px ${family}`;
      }
      ctx.fillText(t, c.width / 2, c.height / 2 - areaH / 2 + (areaH / n) * (i + 0.5));
    });
    ctx.restore();
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex, lines, font]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function Surface({ id }: { id: SurfaceId }) {
  const ref = useRef<THREE.Group>(null);
  const decorations = useDesign((s) => s.present.decorations);
  const active = useDesign((s) => s.surface === id);
  const showBounds = useDesign((s) => s.surface === id && s.selected !== null);
  const list = decorations.filter((d) => d.surface === id);
  const spec = surfaces[id];
  const t = surfaceTransforms[id];
  const bounds = useMemo(() => {
    const w = spec.width / 2;
    const h = spec.height / 2;
    return [[-w, -h, 0], [w, -h, 0], [w, h, 0], [-w, h, 0], [-w, -h, 0]] as [number, number, number][];
  }, [spec]);
  return (
    <group ref={ref} position={t.position} rotation={t.rotation}>
      {showBounds && active && (
        <Line points={bounds} color="#ffffff" transparent opacity={0.45} lineWidth={1} dashed dashSize={0.12} gapSize={0.1} position={[0, 0, 0.001]} />
      )}
      {list.map((d, i) => (
        <Suspense key={d.uid} fallback={null}>
          <Decoration d={d} index={i} surfaceRef={ref} />
        </Suspense>
      ))}
    </group>
  );
}

export function StampModel() {
  const colorId = useDesign((s) => s.present.colorId);
  const lines = useDesign((s) => s.present.printLines);
  const font = useDesign((s) => s.present.printFont);
  const setSurface = useDesign((s) => s.setSurface);
  const select = useDesign((s) => s.select);
  const colors = useAdmin((s) => s.colors);
  const hex = colors.find((c) => c.id === colorId)?.hex ?? "#b9a3e3";
  const rubber = useRubberTexture(lines, font);

  const invalidate = useThree((s) => s.invalidate);
  const bodyMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const [initialHex] = useState(hex); // el color luego se anima en el efecto
  const target = useMemo(() => new THREE.Color(hex), [hex]);
  useEffect(() => {
    // Transición suave del color del cuerpo.
    const m = bodyMat.current;
    if (!m) return;
    const from = m.color.clone();
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 380);
      m.color.copy(from).lerp(target, 1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(step);
      invalidate();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, invalidate]);

  const onBodyClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return; // fue un giro, no un toque
    e.stopPropagation();
    const n = e.face?.normal;
    select(null);
    if (!n) return;
    if (n.y > 0.7) setSurface("arriba", false);
    else if (n.z > 0.7) setSurface("frente", false);
    else if (n.z < -0.7) setSurface("atras", false);
  };

  return (
    <group>
      {/* Cuerpo de plástico */}
      <RoundedBox args={[W, bodyH, D]} radius={bodyRadius} smoothness={5} position={[0, bodyY, 0]} onClick={onBodyClick}>
        <meshPhysicalMaterial ref={bodyMat} color={initialHex} roughness={0.42} metalness={0} clearcoat={0.55} clearcoatRoughness={0.35} sheen={0.25} sheenColor="#ffffff" />
      </RoundedBox>

      {/* Ranuras laterales de agarre */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (W / 2 + 0.001), bodyY - 0.1, 0]}>
          {[-0.5, 0, 0.5].map((z) => (
            <RoundedBox key={z} args={[0.04, bodyH * 0.55, 0.16]} radius={0.02} smoothness={2} position={[0, 0, z]}>
              <meshPhysicalMaterial color={hex} roughness={0.6} clearcoat={0.2} />
            </RoundedBox>
          ))}
        </group>
      ))}

      {/* Marco gris entre cuerpo y base */}
      <RoundedBox args={[W + 0.06, 0.16, D + 0.06]} radius={0.07} smoothness={3} position={[0, -H / 2 + baseH, 0]}>
        <meshPhysicalMaterial color="#2b2b31" roughness={0.35} metalness={0.2} clearcoat={0.6} />
      </RoundedBox>

      {/* Base transparente */}
      <RoundedBox args={[W - 0.12, baseH - 0.08, D - 0.12]} radius={0.22} smoothness={4} position={[0, baseY - 0.04, 0]}>
        <meshPhysicalMaterial
          color="#eef4ff"
          transmission={1}
          thickness={0.6}
          roughness={0.06}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor="#dbe6ff"
          attenuationDistance={4}
          transparent
        />
      </RoundedBox>

      {/* Almohadilla de tinta (visible a través de la base) */}
      <RoundedBox args={[W - 0.9, 0.32, D - 1.0]} radius={0.06} smoothness={2} position={[0, baseY + 0.2, 0]}>
        <meshStandardMaterial color="#1b2552" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, baseY + 0.2, (D - 1.0) / 2 + 0.002]}>
        <planeGeometry args={[W - 1.3, 0.12]} />
        <meshStandardMaterial color="#34407a" roughness={0.8} />
      </mesh>

      {/* Placa de caucho con el texto de impresión (espejado, vista inferior) */}
      <group position={[0, -H / 2 - 0.02, 0]}>
        <RoundedBox args={[W - 0.6, 0.16, D - 0.7]} radius={0.05} smoothness={2} position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#3a3a40" roughness={0.85} />
        </RoundedBox>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
          <planeGeometry args={[W - 0.6, D - 0.7]} />
          <meshStandardMaterial map={rubber} roughness={0.9} />
        </mesh>
      </group>

      {(["frente", "atras", "arriba"] as SurfaceId[]).map((id) => (
        <Surface key={id} id={id} />
      ))}
    </group>
  );
}
