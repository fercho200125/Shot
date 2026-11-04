import type { Product } from "../types";

/**
 * CATÁLOGO DEMO — nombres, descripciones y precios son de demostración.
 * No representan el catálogo, precios ni disponibilidad reales del negocio.
 * Las imágenes están vacías a propósito: se muestran placeholders hasta tener fotos reales.
 */
export const products: Product[] = [
  { id: "p-sello-auto", slug: "sello-automatico-personalizado", name: "Sello automático personalizado", description: "Sello automático con tu texto y decoración elegida en el configurador 3D.", categoryId: "sellos", price: 12, demoPrice: true, images: [], variants: [], availability: "bajo-pedido", featured: true, configurable: true },
  { id: "p-sello-mini", slug: "sello-mini", name: "Sello mini (DEMO)", description: "Formato compacto para firmas cortas. Producto de demostración.", categoryId: "sellos", price: 8, demoPrice: true, images: [], variants: [], availability: "bajo-pedido" },
  { id: "p-fig-pack", slug: "pack-figuras-goma", name: "Pack de figuras de goma (DEMO)", description: "Selección de figuritas para decorar.", categoryId: "figuras", price: 5, demoPrice: true, images: [], variants: [{ id: "v-3", name: "3 unidades" }, { id: "v-5", name: "5 unidades" }], availability: "disponible", featured: true },
  { id: "p-fig-suelta", slug: "figura-goma-individual", name: "Figura de goma individual (DEMO)", description: "Una figurita a elección.", categoryId: "figuras", price: 2, demoPrice: true, images: [], variants: [], availability: "disponible" },
  { id: "p-stk-plancha", slug: "plancha-calcomanias", name: "Plancha de calcomanías (DEMO)", description: "Plancha con stickers troquelados.", categoryId: "calcomanias", price: 3, demoPrice: true, images: [], variants: [], availability: "disponible", featured: true },
  { id: "p-crochet-llavero", slug: "llavero-crochet", name: "Llavero de crochet (DEMO)", description: "Llavero tejido a mano.", categoryId: "crochet", price: 6, demoPrice: true, images: [], variants: [], availability: "bajo-pedido" },
  { id: "p-crochet-amigurumi", slug: "amigurumi", name: "Amigurumi (DEMO)", description: "Muñequito tejido a mano.", categoryId: "crochet", price: 15, demoPrice: true, images: [], variants: [], availability: "bajo-pedido", featured: true },
  { id: "p-retractil", slug: "porta-credencial-retractil", name: "Porta credencial retráctil (DEMO)", description: "Retráctil decorado con figuritas.", categoryId: "porta-credenciales", price: 7, demoPrice: true, images: [], variants: [{ id: "v-clip", name: "Con clip" }, { id: "v-mosq", name: "Con mosquetón" }], availability: "disponible", featured: true },
  { id: "p-tinta", slug: "repuesto-tinta", name: "Repuesto de tinta (DEMO)", description: "Almohadilla de repuesto para sello automático.", categoryId: "accesorios", price: 3, demoPrice: true, images: [], variants: [{ id: "v-azul", name: "Azul" }, { id: "v-negro", name: "Negro" }], availability: "disponible", featured: true },
  { id: "p-funda", slug: "funda-sello", name: "Funda para sello (DEMO)", description: "Funda protectora.", categoryId: "accesorios", price: 4, demoPrice: true, images: [], variants: [], availability: "agotado" },
];

export const getProduct = (idOrSlug: string) =>
  products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

export const STAMP_PRODUCT_ID = "p-sello-auto";
