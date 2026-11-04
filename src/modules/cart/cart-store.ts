"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, StampDesign } from "@/lib/types";
import { getProduct, STAMP_PRODUCT_ID } from "@/lib/data/products";

interface CartState {
  lines: CartLine[];
  open: boolean;
  lastAdded: string | null;
  addProduct: (productId: string, variantId?: string, qty?: number) => void;
  addStamp: (design: StampDesign) => void;
  setQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      lastAdded: null,
      addProduct: (productId, variantId, qty = 1) => {
        const existing = get().lines.find(
          (l) => l.type === "producto" && l.productId === productId && l.variantId === variantId,
        );
        if (existing) {
          set({ lines: get().lines.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l)), open: true, lastAdded: existing.lineId });
          return;
        }
        const lineId = uid();
        set({ lines: [...get().lines, { type: "producto", lineId, productId, variantId, qty }], open: true, lastAdded: lineId });
      },
      addStamp: (design) => {
        const lineId = uid();
        // Copia profunda: el diseño guardado no cambia si el cliente sigue editando.
        const snapshot: StampDesign = JSON.parse(JSON.stringify(design));
        set({ lines: [...get().lines, { type: "sello", lineId, productId: STAMP_PRODUCT_ID, qty: 1, design: snapshot }], open: true, lastAdded: lineId });
      },
      setQty: (lineId, qty) =>
        set({ lines: get().lines.map((l) => (l.lineId === lineId ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l)) }),
      remove: (lineId) => set({ lines: get().lines.filter((l) => l.lineId !== lineId) }),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "medistamp-cart", partialize: (s) => ({ lines: s.lines }) },
  ),
);

export function lineUnitPrice(line: CartLine) {
  return getProduct(line.productId)?.price ?? null;
}

export function cartTotals(lines: CartLine[]) {
  let total = 0;
  let unpriced = 0;
  let count = 0;
  for (const l of lines) {
    count += l.qty;
    const p = lineUnitPrice(l);
    if (p == null) unpriced += l.qty;
    else total += p * l.qty;
  }
  return { total, unpriced, count };
}
