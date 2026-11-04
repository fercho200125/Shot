/**
 * Tipos de dominio compartidos por tienda, configurador, carrito y panel.
 * Están pensados para mapearse 1:1 con tablas de una futura base de datos.
 */

export type CategoryId =
  | "sellos"
  | "figuras"
  | "calcomanias"
  | "crochet"
  | "porta-credenciales"
  | "accesorios";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  description: string;
  /** Tono de acento usado en placeholders y tarjetas. */
  tint: string;
  icon: string;
}

export interface ProductVariant {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: CategoryId;
  /** Precio en USD. null = sin precio definido. */
  price: number | null;
  /** true cuando el precio es un valor de demostración. */
  demoPrice: boolean;
  images: string[];
  variants: ProductVariant[];
  availability: "disponible" | "bajo-pedido" | "agotado";
  featured?: boolean;
  /** Si es configurable, enlaza al configurador 3D. */
  configurable?: boolean;
}

/* ------------------------- Configurador ------------------------- */

export type SurfaceId = "frente" | "atras" | "arriba";

export interface BodyColor {
  id: string;
  name: string;
  hex: string;
  active: boolean;
}

export type DecorationKind = "figura" | "calcomania";

export interface DecorationAsset {
  id: string;
  kind: DecorationKind;
  name: string;
  /** Recurso 2D (SVG/PNG transparente). */
  src: string;
  /** Tamaño físico fijo del recurso en cm (no escalable por el cliente). */
  widthCm: number;
  heightCm: number;
  active: boolean;
}

export interface PlacedDecoration {
  uid: string;
  assetId: string;
  kind: DecorationKind;
  surface: SurfaceId;
  /** Posición del centro en cm, relativa al centro de la superficie. */
  x: number;
  y: number;
  /** Rotación en grados sobre la normal de la superficie. */
  rotation: number;
}

export interface StampDesign {
  colorId: string;
  decorations: PlacedDecoration[];
  /** Líneas del texto de impresión real del sello. */
  printLines: string[];
  printFont: "sans" | "serif" | "script";
}

/* --------------------------- Carrito ---------------------------- */

export interface CartProductLine {
  type: "producto";
  lineId: string;
  productId: string;
  variantId?: string;
  qty: number;
}

export interface CartStampLine {
  type: "sello";
  lineId: string;
  productId: string;
  qty: number;
  design: StampDesign;
}

export type CartLine = CartProductLine | CartStampLine;

/* ---------------------- Inventario / pedidos -------------------- */

export interface InventoryItem {
  sku: string;
  productId: string;
  name: string;
  qty: number;
}

export type MovementReason =
  | "ajuste-manual"
  | "pedido-confirmado"
  | "pedido-cancelado";

export interface InventoryMovement {
  id: string;
  sku: string;
  previousQty: number;
  newQty: number;
  difference: number;
  at: string; // ISO
  reason: MovementReason;
  note?: string;
  orderId?: string;
}

export type OrderStatus = "pendiente" | "confirmado" | "cancelado";

export interface OrderLine {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number | null;
  design?: StampDesign;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  status: OrderStatus;
  lines: OrderLine[];
  /** Marca de tiempo de confirmación, evita confirmaciones duplicadas. */
  confirmedAt?: string;
  cancelledAt?: string;
  demo: boolean;
}
