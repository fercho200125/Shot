/** Resuelve una ruta de `public/` respetando la `base` configurada en Vite. */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
