/**
 * Lógica de inventario y pedidos — funciones puras, independientes de la UI y
 * de la persistencia. Al conectar una base de datos, estas reglas deben
 * ejecutarse dentro de una transacción en el servidor.
 */
import type { InventoryItem, InventoryMovement, MovementReason, Order } from "../types";

export interface InventoryState {
  inventory: InventoryItem[];
  movements: InventoryMovement[];
  orders: Order[];
}

export type Result = { ok: true; state: InventoryState } | { ok: false; error: string };

let seq = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

function move(
  state: InventoryState,
  sku: string,
  newQty: number,
  reason: MovementReason,
  at: string,
  extra: Partial<InventoryMovement> = {},
): InventoryState {
  const item = state.inventory.find((i) => i.sku === sku);
  if (!item) return state;
  const movement: InventoryMovement = {
    id: newId("MOV"),
    sku,
    previousQty: item.qty,
    newQty,
    difference: newQty - item.qty,
    at,
    reason,
    ...extra,
  };
  return {
    ...state,
    inventory: state.inventory.map((i) => (i.sku === sku ? { ...i, qty: newQty } : i)),
    movements: [movement, ...state.movements],
  };
}

/** Ajuste manual: registra cantidad anterior, nueva, diferencia, fecha y motivo. */
export function adjustStock(
  state: InventoryState,
  sku: string,
  newQty: number,
  note: string,
  at = new Date().toISOString(),
): Result {
  const item = state.inventory.find((i) => i.sku === sku);
  if (!item) return { ok: false, error: "Artículo no encontrado." };
  if (!Number.isInteger(newQty) || newQty < 0) return { ok: false, error: "La cantidad debe ser un entero mayor o igual a 0." };
  if (!note.trim()) return { ok: false, error: "Indica el motivo del ajuste." };
  if (newQty === item.qty) return { ok: false, error: "La cantidad nueva es igual a la actual." };
  return { ok: true, state: move(state, sku, newQty, "ajuste-manual", at, { note: note.trim() }) };
}

/** Unidades requeridas por SKU en un pedido. */
function requiredBySku(order: Order) {
  const map = new Map<string, number>();
  for (const l of order.lines) map.set(l.sku, (map.get(l.sku) ?? 0) + l.qty);
  return map;
}

/** Faltantes de stock para confirmar un pedido. */
export function shortages(state: InventoryState, order: Order) {
  const out: { sku: string; required: number; available: number }[] = [];
  for (const [sku, required] of requiredBySku(order)) {
    const available = state.inventory.find((i) => i.sku === sku)?.qty ?? 0;
    if (available < required) out.push({ sku, required, available });
  }
  return out;
}

/**
 * Confirma un pedido pendiente y descuenta el inventario.
 * - Los pendientes no descuentan stock.
 * - No se confirma sin disponibilidad.
 * - Un pedido ya confirmado no puede confirmarse otra vez.
 */
export function confirmOrder(state: InventoryState, orderId: string, at = new Date().toISOString()): Result {
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return { ok: false, error: "Pedido no encontrado." };
  if (order.status === "confirmado" || order.confirmedAt) return { ok: false, error: "El pedido ya fue confirmado." };
  if (order.status !== "pendiente") return { ok: false, error: "Solo se pueden confirmar pedidos pendientes." };
  const missing = shortages(state, order);
  if (missing.length) {
    return { ok: false, error: `Stock insuficiente: ${missing.map((m) => `${m.sku} (necesita ${m.required}, hay ${m.available})`).join(", ")}.` };
  }
  let next = state;
  for (const [sku, qty] of requiredBySku(order)) {
    const cur = next.inventory.find((i) => i.sku === sku)!.qty;
    next = move(next, sku, cur - qty, "pedido-confirmado", at, { orderId });
  }
  next = { ...next, orders: next.orders.map((o) => (o.id === orderId ? { ...o, status: "confirmado", confirmedAt: at } : o)) };
  return { ok: true, state: next };
}

/**
 * Cancela un pedido. Si estaba confirmado, devuelve las unidades al inventario.
 * El historial de movimientos se conserva siempre.
 */
export function cancelOrder(state: InventoryState, orderId: string, at = new Date().toISOString()): Result {
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return { ok: false, error: "Pedido no encontrado." };
  if (order.status === "cancelado") return { ok: false, error: "El pedido ya está cancelado." };
  let next = state;
  if (order.status === "confirmado") {
    for (const [sku, qty] of requiredBySku(order)) {
      const cur = next.inventory.find((i) => i.sku === sku)?.qty;
      if (cur == null) continue;
      next = move(next, sku, cur + qty, "pedido-cancelado", at, { orderId });
    }
  }
  next = { ...next, orders: next.orders.map((o) => (o.id === orderId ? { ...o, status: "cancelado", cancelledAt: at } : o)) };
  return { ok: true, state: next };
}
