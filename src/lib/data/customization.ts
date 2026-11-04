import type { BodyColor, DecorationAsset } from "../types";

/**
 * Catálogo inicial de presentación: 4 colores, 5 figuras y 5 calcomanías.
 * Ilustraciones originales provisionales (SVG) — reemplazables por los recursos reales.
 */
export const demoColors: BodyColor[] = [
  { id: "lila", name: "Lila", hex: "#b9a3e3", active: true },
  { id: "rosa", name: "Rosa", hex: "#f4a7c4", active: true },
  { id: "menta", name: "Menta", hex: "#9edfcb", active: true },
  { id: "celeste", name: "Celeste", hex: "#a7c7f4", active: true },
];

export const demoAssets: DecorationAsset[] = [
  { id: "fig-osito", kind: "figura", name: "Osito", src: "/decor/figuras/osito.svg", widthCm: 1.6, heightCm: 1.6, active: true },
  { id: "fig-corazon", kind: "figura", name: "Corazón", src: "/decor/figuras/corazon.svg", widthCm: 1.5, heightCm: 1.5, active: true },
  { id: "fig-flor", kind: "figura", name: "Flor", src: "/decor/figuras/flor.svg", widthCm: 1.6, heightCm: 1.6, active: true },
  { id: "fig-estrella", kind: "figura", name: "Estrella", src: "/decor/figuras/estrella.svg", widthCm: 1.5, heightCm: 1.5, active: true },
  { id: "fig-gatito", kind: "figura", name: "Gatito", src: "/decor/figuras/gatito.svg", widthCm: 1.6, heightCm: 1.6, active: true },
  { id: "stk-arcoiris", kind: "calcomania", name: "Arcoíris", src: "/decor/calcomanias/arcoiris.svg", widthCm: 1.4, heightCm: 1.4, active: true },
  { id: "stk-mariposa", kind: "calcomania", name: "Mariposa", src: "/decor/calcomanias/mariposa.svg", widthCm: 1.3, heightCm: 1.3, active: true },
  { id: "stk-fresa", kind: "calcomania", name: "Fresa", src: "/decor/calcomanias/fresa.svg", widthCm: 1.2, heightCm: 1.2, active: true },
  { id: "stk-luna", kind: "calcomania", name: "Luna", src: "/decor/calcomanias/luna.svg", widthCm: 1.3, heightCm: 1.3, active: true },
  { id: "stk-curita", kind: "calcomania", name: "Curita", src: "/decor/calcomanias/curita.svg", widthCm: 1.4, heightCm: 1.4, active: true },
];
