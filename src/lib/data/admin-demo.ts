import type { InventoryItem, Order } from "../types";

/** INVENTARIO DEMO — cantidades ficticias para probar la interfaz. No es inventario real. */
export const demoInventory: InventoryItem[] = [
  { sku: "SELLO-AUTO", productId: "p-sello-auto", name: "Sello automático (cuerpo)", qty: 12 },
  { sku: "SELLO-MINI", productId: "p-sello-mini", name: "Sello mini", qty: 4 },
  { sku: "FIG-PACK", productId: "p-fig-pack", name: "Pack de figuras de goma", qty: 20 },
  { sku: "FIG-1", productId: "p-fig-suelta", name: "Figura de goma individual", qty: 35 },
  { sku: "STK-PLANCHA", productId: "p-stk-plancha", name: "Plancha de calcomanías", qty: 15 },
  { sku: "CRO-LLAVERO", productId: "p-crochet-llavero", name: "Llavero de crochet", qty: 3 },
  { sku: "CRO-AMI", productId: "p-crochet-amigurumi", name: "Amigurumi", qty: 2 },
  { sku: "RETRACTIL", productId: "p-retractil", name: "Porta credencial retráctil", qty: 9 },
  { sku: "TINTA", productId: "p-tinta", name: "Repuesto de tinta", qty: 10 },
  { sku: "FUNDA", productId: "p-funda", name: "Funda para sello", qty: 0 },
];

const now = Date.now();
const iso = (hAgo: number) => new Date(now - hAgo * 3600_000).toISOString();

/** PEDIDOS DEMO — clientes y pedidos ficticios. */
export const demoOrders: Order[] = [
  { id: "DEMO-1001", createdAt: iso(2), customerName: "Cliente demo A", status: "pendiente", demo: true, lines: [{ sku: "SELLO-AUTO", name: "Sello automático personalizado", qty: 1, unitPrice: 12 }] },
  { id: "DEMO-1002", createdAt: iso(26), customerName: "Cliente demo B", status: "pendiente", demo: true, lines: [{ sku: "CRO-AMI", name: "Amigurumi", qty: 3, unitPrice: 15 }] },
  { id: "DEMO-1003", createdAt: iso(50), customerName: "Cliente demo C", status: "confirmado", confirmedAt: iso(48), demo: true, lines: [{ sku: "RETRACTIL", name: "Porta credencial retráctil", qty: 2, unitPrice: 7 }] },
  { id: "DEMO-1004", createdAt: iso(80), customerName: "Cliente demo D", status: "cancelado", cancelledAt: iso(70), demo: true, lines: [{ sku: "TINTA", name: "Repuesto de tinta", qty: 1, unitPrice: 3 }] },
];

/** Relación producto → SKU de inventario. */
export const skuForProduct = (productId: string) =>
  demoInventory.find((i) => i.productId === productId)?.sku ?? productId;
