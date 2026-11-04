"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { stampSpec } from "@/lib/stamp-spec";
import type { SurfaceId } from "@/lib/types";
import { useDesign } from "../design-store";
import { StampModel } from "./StampModel";

const FOV = 30;
const RADIUS = Math.hypot(stampSpec.width, stampSpec.height, stampSpec.depth) / 2;

/** Ángulos de cámara para cada superficie (azimut, polar). */
const views: Record<SurfaceId, { theta: number; phi: number }> = {
  frente: { theta: 0.42, phi: 1.2 },
  atras: { theta: Math.PI - 0.42, phi: 1.2 },
  arriba: { theta: 0.25, phi: 0.42 },
};

/**
 * Distancia fija de cámara calculada para que el sello quepa en el lienzo.
 * Solo cambia si cambia el tamaño del lienzo: no hay zoom de usuario.
 */
function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;
  const invalidate = useThree((s) => s.invalidate);
  const view = useDesign((s) => s.view);
  const anim = useRef<{ theta: number; phi: number } | null>(null);

  useEffect(() => {
    const aspect = size.width / size.height;
    const vFov = (FOV * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const dist = (RADIUS * 1.42) / Math.sin(Math.min(vFov, hFov) / 2);
    const dir = camera.position.clone().normalize();
    if (dir.lengthSq() === 0) dir.set(0, 0, 1);
    camera.position.copy(dir.multiplyScalar(dist));
    camera.near = dist / 10;
    camera.far = dist * 10;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.minDistance = controls.maxDistance = dist;
      controls.update();
    }
    invalidate();
  }, [size, camera, controls, invalidate]);

  useEffect(() => {
    if (view.nonce === 0) return;
    anim.current = views[view.surface];
    invalidate();
  }, [view, invalidate]);

  useEffect(() => {
    if (!controls) return;
    const stop = () => (anim.current = null);
    controls.addEventListener("start", stop);
    return () => controls.removeEventListener("start", stop);
  }, [controls]);

  useFrame((_, dt) => {
    const target = anim.current;
    if (!target || !controls) return;
    const sph = new THREE.Spherical().setFromVector3(camera.position);
    let dTheta = target.theta - sph.theta;
    dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta)); // camino más corto
    const k = 1 - Math.exp(-dt * 7);
    sph.theta += dTheta * k;
    sph.phi += (target.phi - sph.phi) * k;
    camera.position.setFromSpherical(sph);
    controls.update();
    if (Math.abs(dTheta) < 0.002 && Math.abs(target.phi - sph.phi) < 0.002) anim.current = null;
    invalidate();
  });
  return null;
}

/** Disco de piso con brillo radial: da lectura a la sombra de contacto sobre fondo oscuro. */
function Floor() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(255,255,255,0.16)");
    grd.addColorStop(0.45, "rgba(255,255,255,0.06)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -stampSpec.height / 2 - 0.04, 0]} renderOrder={-1}>
      <circleGeometry args={[8, 64]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* Softbox principal superior */}
      <Lightformer form="rect" intensity={2.2} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} />
      {/* Tiras laterales para reflejos alargados */}
      <Lightformer form="rect" intensity={1.6} position={[-6, 1.5, 1]} rotation-y={Math.PI / 2} scale={[8, 1.4, 1]} />
      <Lightformer form="rect" intensity={1.1} position={[6, 1, -1]} rotation-y={-Math.PI / 2} scale={[8, 1.2, 1]} />
      {/* Contraluz frío */}
      <Lightformer form="ring" color="#c9d6ff" intensity={1.2} position={[0, 2, -7]} scale={4} />
      {/* Relleno cálido frontal tenue */}
      <Lightformer form="rect" color="#ffe9f2" intensity={0.5} position={[0, 0, 8]} scale={[6, 3, 1]} />
    </Environment>
  );
}

export function StampScene({ onMissed }: { onMissed: () => void }) {
  const down = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      className="absolute inset-0"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY })}
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: FOV, position: [3.2, 3.6, 9.5] }}
        onPointerMissed={(e) => {
          const d = down.current;
          if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) onMissed();
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 8, 6]} intensity={1.1} />
        <directionalLight position={[-5, 3, -4]} intensity={0.45} color="#c9d6ff" />
        <Suspense fallback={null}>
          <Studio />
          <StampModel />
        </Suspense>
        <Floor />
        <ContactShadows position={[0, -stampSpec.height / 2 - 0.03, 0]} scale={16} blur={2.6} far={6} opacity={0.65} resolution={384} color="#000000" />
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.09}
          rotateSpeed={0.75}
          minPolarAngle={0.12}
          maxPolarAngle={Math.PI - 0.25}
          target={[0, 0, 0]}
        />
        <CameraRig />
      </Canvas>
    </div>
  );
}
