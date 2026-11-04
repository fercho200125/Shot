"use client";
/**
 * Repositorio LOCAL (DEMO) del panel administrativo.
 * Persiste en localStorage del navegador. Para conectar una base de datos,
 * reemplazar las acciones por llamadas a la API manteniendo la misma interfaz.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BodyColor, DecorationAsset, Order } from "@/lib/types";
import { demoInventory, demoOrders } from "@/lib/data/admin-demo";
import { demoAssets, demoColors } from "@/lib/data/customization";
import { adjustStock, cancelOrder, confirmOrder, type InventoryState } from "@/lib/domain/inventory";

interface AdminState extends InventoryState {
  colors: BodyColor[];
  assets: DecorationAsset[];
  settings: { whatsappNumber: string; businessName: string };
  lastError: string | null;
  adjust: (sku: string, qty: number, note: string) => boolean;
  confirm: (orderId: string) => boolean;
  cancel: (orderId: string) => boolean;
  addOrder: (order: Order) => void;
  toggleColor: (id: string) => void;
  toggleAsset: (id: string) => void;
  updateSettings: (s: Partial<AdminState["settings"]>) => void;
  clearError: () => void;
  resetDemo: () => void;
}

const initial = () => ({
  inventory: demoInventory,
  movements: [],
  orders: demoOrders,
  colors: demoColors,
  assets: demoAssets,
  settings: { whatsappNumber: "", businessName: "Medistamp" },
  lastError: null,
});

export const useAdmin = create<AdminState>()(
  persist(
    (set, get) => {
      const apply = (r: ReturnType<typeof adjustStock>) => {
        if (r.ok) {
          set({ inventory: r.state.inventory, movements: r.state.movements, orders: r.state.orders, lastError: null });
          return true;
        }
        set({ lastError: r.error });
        return false;
      };
      return {
        ...initial(),
        adjust: (sku, qty, note) => apply(adjustStock(get(), sku, qty, note)),
        confirm: (id) => apply(confirmOrder(get(), id)),
        cancel: (id) => apply(cancelOrder(get(), id)),
        addOrder: (order) => set({ orders: [order, ...get().orders] }),
        toggleColor: (id) => {
          const colors = get().colors;
          const activeCount = colors.filter((c) => c.active).length;
          const target = colors.find((c) => c.id === id);
          if (target?.active && activeCount <= 1) return set({ lastError: "Debe quedar al menos un color activo." });
          set({ colors: colors.map((c) => (c.id === id ? { ...c, active: !c.active } : c)), lastError: null });
        },
        toggleAsset: (id) => set({ assets: get().assets.map((a) => (a.id === id ? { ...a, active: !a.active } : a)) }),
        updateSettings: (s) => set({ settings: { ...get().settings, ...s } }),
        clearError: () => set({ lastError: null }),
        resetDemo: () => set(initial()),
      };
    },
    { name: "medistamp-admin-demo", version: 1 },
  ),
);
