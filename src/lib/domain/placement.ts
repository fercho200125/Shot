/** Geometría de colocación de decoraciones sobre una superficie (unidades: cm). */

/** Semiextensiones del rectángulo envolvente de un elemento rotado. */
export function rotatedHalfExtents(w: number, h: number, rotationDeg: number) {
  const r = (rotationDeg * Math.PI) / 180;
  const c = Math.abs(Math.cos(r));
  const s = Math.abs(Math.sin(r));
  return { hx: (w * c + h * s) / 2, hy: (w * s + h * c) / 2 };
}

/** Restringe el centro del elemento para que quede dentro de la superficie. */
export function clampToSurface(
  x: number,
  y: number,
  rotationDeg: number,
  itemW: number,
  itemH: number,
  surfaceW: number,
  surfaceH: number,
) {
  const { hx, hy } = rotatedHalfExtents(itemW, itemH, rotationDeg);
  const maxX = Math.max(0, surfaceW / 2 - hx);
  const maxY = Math.max(0, surfaceH / 2 - hy);
  return {
    x: Math.min(maxX, Math.max(-maxX, x)),
    y: Math.min(maxY, Math.max(-maxY, y)),
  };
}

export function fits(itemW: number, itemH: number, surfaceW: number, surfaceH: number) {
  return itemW <= surfaceW && itemH <= surfaceH;
}

/** Busca una posición libre aproximada para un elemento nuevo. */
export function findFreeSpot(
  taken: { x: number; y: number }[],
  itemW: number,
  itemH: number,
  surfaceW: number,
  surfaceH: number,
) {
  const candidates: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  const stepX = itemW * 0.9;
  const stepY = itemH * 0.9;
  for (const dy of [0, -1, 1]) for (const dx of [-1, 1, -2, 2, 0]) candidates.push({ x: dx * stepX, y: dy * stepY });
  const minDist = Math.min(itemW, itemH) * 0.7;
  for (const c of candidates) {
    const p = clampToSurface(c.x, c.y, 0, itemW, itemH, surfaceW, surfaceH);
    if (taken.every((t) => Math.hypot(t.x - p.x, t.y - p.y) > minDist)) return p;
  }
  return { x: 0, y: 0 };
}
