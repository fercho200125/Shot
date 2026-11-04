"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cartTotals, lineUnitPrice, useCart } from "./cart-store";
import { getProduct } from "@/lib/data/products";
import { describeDesign } from "@/lib/order-message";
import { formatPrice } from "@/lib/site";
import { StampThumb } from "@/modules/configurator/StampThumb";
import { ProductPlaceholder } from "@/components/Placeholder";
import { DemoBadge } from "@/components/DemoBadge";
import { useHydrated } from "@/lib/use-hydrated";
import type { CartLine } from "@/lib/types";

export function CartLineRow({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const p = getProduct(line.productId);
  const price = lineUnitPrice(line);
  const variant = line.type === "producto" ? p?.variants.find((v) => v.id === line.variantId) : undefined;
  const d = line.type === "sello" ? describeDesign(line.design) : null;
  return (
    <li className="animate-pop flex gap-3 py-4">
      <div className={`shrink-0 overflow-hidden rounded-2xl bg-mist ${compact ? "size-20" : "size-24"}`}>
        {line.type === "sello" ? (
          <StampThumb design={line.design} className="size-full p-2" />
        ) : (
          <ProductPlaceholder categoryId={p?.categoryId ?? ""} className="size-full" label={false} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium">{line.type === "sello" ? "Sello personalizado" : p?.name}</p>
            {line.type === "sello" && (
              <span className="mt-0.5 inline-flex rounded-full bg-lila-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lila-deep">Personalizado</span>
            )}
            {variant && <p className="text-xs text-ink-mute">{variant.name}</p>}
          </div>
          <button onClick={() => remove(line.lineId)} className="grid size-8 shrink-0 place-items-center rounded-full text-ink-mute hover:bg-black/5 hover:text-red-500" aria-label="Eliminar">
            <Trash2 className="size-4" />
          </button>
        </div>
        {d && (
          <div className="mt-1.5 space-y-0.5 text-xs text-ink-soft">
            <p>Color: <b className="font-medium text-ink">{d.color}</b></p>
            <p className="truncate">Texto: <span className="text-ink">{d.text}</span></p>
            <p>{d.decos.length ? `${d.decos.length} decoración${d.decos.length > 1 ? "es" : ""}` : "Sin decoraciones"}</p>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-line">
            <button onClick={() => setQty(line.lineId, line.qty - 1)} className="grid size-8 place-items-center" aria-label="Restar"><Minus className="size-3.5" /></button>
            <span className="w-6 text-center text-sm tabular-nums">{line.qty}</span>
            <button onClick={() => setQty(line.lineId, line.qty + 1)} className="grid size-8 place-items-center" aria-label="Sumar"><Plus className="size-3.5" /></button>
          </div>
          <span className="text-sm font-medium tabular-nums">{price == null ? "Por confirmar" : formatPrice(price * line.qty)}</span>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { lines, open, setOpen } = useCart();
  const hydrated = useHydrated();
  const totals = cartTotals(lines);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!hydrated) return null;
  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Carrito"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-pearl shadow-2xl transition-transform duration-500 ease-[var(--ease-fluid)] sm:inset-y-3 sm:right-3 sm:rounded-[28px] ${open ? "translate-x-0" : "translate-x-[105%]"}`}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <h2 className="text-lg font-semibold">Tu carrito</h2>
          <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-black/5" aria-label="Cerrar"><X className="size-5" /></button>
        </div>
        {lines.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-lila-soft"><ShoppingBag className="size-7 text-lila-deep" /></div>
              <p className="font-medium">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-ink-soft">Diseña tu sello o explora el catálogo.</p>
              <div className="mt-5 flex justify-center gap-2">
                <Link onClick={() => setOpen(false)} href="/configurador" className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white">Diseñar sello</Link>
                <Link onClick={() => setOpen(false)} href="/catalogo" className="rounded-full border border-line bg-white px-4 py-2.5 text-sm">Catálogo</Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => <CartLineRow key={l.lineId} line={l} compact />)}
            </ul>
            <div className="border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-ink-soft">Total estimado <DemoBadge label="PRECIOS DEMO" /></span>
                <span className="text-lg font-semibold tabular-nums">{formatPrice(totals.total)}</span>
              </div>
              <Link onClick={() => setOpen(false)} href="/carrito" className="mt-4 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-medium text-white transition active:scale-[0.98]">
                Revisar pedido
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
