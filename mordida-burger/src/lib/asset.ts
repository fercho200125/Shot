// En la versión de un solo archivo (npm run build:single) las imágenes van incrustadas en este mapa.
const inlined = (globalThis as { __MORDIDA_ASSETS__?: Record<string, string> }).__MORDIDA_ASSETS__;

/** Resuelve una ruta de `public/` respetando la `base` configurada en Vite. */
export function asset(path: string): string {
  return inlined?.[path] ?? `${import.meta.env.BASE_URL}${path}`;
}
