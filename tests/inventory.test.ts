import { test } from "node:test";
import assert from "node:assert/strict";
import { adjustStock, cancelOrder, confirmOrder, type InventoryState } from "../src/lib/domain/inventory.ts";

const base = (): InventoryState => ({
  inventory: [{ sku: "A", productId: "a", name: "A", qty: 5 }],
  movements: [],
  orders: [
    { id: "o1", createdAt: "", customerName: "x", status: "pendiente", demo: true, lines: [{ sku: "A", name: "A", qty: 3, unitPrice: 1 }] },
    { id: "o2", createdAt: "", customerName: "y", status: "pendiente", demo: true, lines: [{ sku: "A", name: "A", qty: 9, unitPrice: 1 }] },
  ],
});

test("pendiente no descuenta; confirmar descuenta", () => {
  const s = base();
  assert.equal(s.inventory[0].qty, 5);
  const r = confirmOrder(s, "o1");
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.state.inventory[0].qty, 2);
    assert.equal(r.state.movements[0].difference, -3);
  }
});

test("no confirma sin stock", () => {
  const r = confirmOrder(base(), "o2");
  assert.equal(r.ok, false);
});

test("evita confirmación duplicada", () => {
  const r = confirmOrder(base(), "o1");
  assert.ok(r.ok);
  if (r.ok) assert.equal(confirmOrder(r.state, "o1").ok, false);
});

test("cancelar confirmado devuelve stock y conserva historial", () => {
  const r = confirmOrder(base(), "o1");
  assert.ok(r.ok);
  if (!r.ok) return;
  const c = cancelOrder(r.state, "o1");
  assert.ok(c.ok);
  if (c.ok) {
    assert.equal(c.state.inventory[0].qty, 5);
    assert.equal(c.state.movements.length, 2);
    assert.equal(c.state.orders[0].status, "cancelado");
  }
});

test("ajuste manual registra anterior/nueva/diferencia y exige motivo", () => {
  assert.equal(adjustStock(base(), "A", 8, "").ok, false);
  const r = adjustStock(base(), "A", 8, "Conteo físico");
  assert.ok(r.ok);
  if (r.ok) assert.deepEqual([r.state.movements[0].previousQty, r.state.movements[0].newQty, r.state.movements[0].difference], [5, 8, 3]);
});

import { clampToSurface } from "../src/lib/domain/placement.ts";
test("clamp respeta los límites, incluso rotado", () => {
  assert.deepEqual(clampToSurface(10, -10, 0, 1, 1, 4, 2), { x: 1.5, y: -0.5 });
  const r = clampToSurface(10, 0, 45, 1, 1, 4, 2);
  assert.ok(Math.abs(r.x - (2 - Math.SQRT2 / 2)) < 1e-9);
});
