import type { Category } from "../types";

export const categories: Category[] = [
  { id: "sellos", name: "Sellos personalizados", short: "Sellos", description: "Sellos automáticos decorados a tu gusto, con tu nombre o profesión.", tint: "#b9a3e3", icon: "stamp" },
  { id: "figuras", name: "Figuras de goma", short: "Figuras", description: "Figuritas de goma para decorar sellos, llaveros y accesorios.", tint: "#f4a7c4", icon: "bear" },
  { id: "calcomanias", name: "Calcomanías", short: "Calcomanías", description: "Stickers troquelados para personalizar tus cosas.", tint: "#9edfcb", icon: "sticker" },
  { id: "crochet", name: "Artículos de crochet", short: "Crochet", description: "Piezas tejidas a mano, una por una.", tint: "#f7d28b", icon: "yarn" },
  { id: "porta-credenciales", name: "Porta credenciales retráctiles", short: "Porta credenciales", description: "Retráctiles decorados para tu credencial del trabajo.", tint: "#a7c7f4", icon: "badge" },
  { id: "accesorios", name: "Accesorios", short: "Accesorios", description: "Complementos y repuestos para tus sellos y credenciales.", tint: "#d9d4cc", icon: "sparkle" },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);
