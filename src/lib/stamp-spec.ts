import type { SurfaceId } from "./types";

/**
 * Especificación física PROVISIONAL del sello automático.
 * Dimensiones aproximadas de referencia (cm). Confirmar con el producto físico
 * antes de presentarlas como medidas definitivas.
 */
export const stampSpec = {
  width: 5.3, // eje X
  height: 5.0, // eje Y
  depth: 3.3, // eje Z
  /** Alto de la base transparente inferior. */
  baseHeight: 1.1,
  /** Área de impresión referencial (cm). */
  print: { width: 4.7, height: 1.8 },
  /** Ruta futura del modelo real. Cuando exista, StampModel lo cargará. */
  glbUrl: null as string | null,
};

export interface SurfaceSpec {
  id: SurfaceId;
  label: string;
  /** Tamaño útil decorable (cm). */
  width: number;
  height: number;
}

export const bodyH = stampSpec.height - stampSpec.baseHeight;
/** Radio de redondeo del cuerpo (las superficies decorables quedan dentro de la zona plana). */
export const bodyRadius = 0.35;

export const surfaces: Record<SurfaceId, SurfaceSpec> = {
  frente: { id: "frente", label: "Frente", width: stampSpec.width - 0.8, height: bodyH - 0.8 },
  atras: { id: "atras", label: "Atrás", width: stampSpec.width - 0.8, height: bodyH - 0.8 },
  arriba: { id: "arriba", label: "Arriba", width: stampSpec.width - 0.8, height: stampSpec.depth - 0.8 },
};

export const surfaceOrder: SurfaceId[] = ["frente", "arriba", "atras"];
