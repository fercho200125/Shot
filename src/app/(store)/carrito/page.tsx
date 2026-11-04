"use client";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { cartTotals, lineUnitPrice, useCart } from "@/modules/cart/cart-store";
import { CartLineRow } from "@/modules/cart/CartDrawer";
import { useAdmin } from "@/modules/admin/admin-store";
import { DemoBadge } from "@/components/DemoBadge";
import { formatPrice, whatsappLink } from "@/lib/site";
import { buildOrderMessage } from "@/lib/order-message";
import { getProduct } from "@/lib/data/products";
import { skuForProduct } from "@/lib/data/admin-demo";
import { useHydrated } from "@/lib/use-hydrated";
import type { Order } from "@/lib/types";

export default function CartPage() {
  const hydrated = useHydrated();
  const { lines, clear } = useCart();
  const addOrder = useAdmin((s) => s.addOrder);
  const whatsappNumber = useAdmin((s) => s.settings.whatsappNumber);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState<{ id: string; link: string } | null>(null);
  const totals = cartTotals(lines);

  if (!hydrated) return <div className="min-h-[60vh]" />;

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-16 text-center">
        <CheckCircle2 className="animate-pop mx-auto size-14 text-lila-deep" strokeWidth={1.5} />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Solicitud preparada</h1>
        <p className="mt-3 text-ink-soft">
          Tu referencia es <b className="text-ink">{sent.id}</b>. El pedido queda <b>pendiente</b> hasta que la tienda lo confirme por WhatsApp. No se ha realizado ningún pago.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a href={sent.link} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1faa59] px-6 font-medium text-white">
            <MessageCircle className="size-5" /> Abrir WhatsApp de nuevo
          </a>
          <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white px-6">Volver a la tienda</Link>
        </div>
        <p className="mt-6 text-xs text-ink-mute">Modo demostración: la solicitud se guarda solo en este navegador.</p>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-20 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-lila-soft"><ShoppingBag className="size-7 text-lila-deep" /></div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Tu carrito está vacío</h1>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/configurador" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">Diseñar sello</Link>
          <Link href="/catalogo" className="rounded-full border border-line bg-white px-5 py-3 text-sm">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `MS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      customerName: name.trim(),
      customerPhone: phone.trim() || undefined,
      status: "pendiente",
      demo: true,
      lines: lines.map((l) => ({
        sku: skuForProduct(l.productId),
        name: l.type === "sello" ? "Sello automático personalizado" : getProduct(l.productId)?.name ?? l.productId,
        qty: l.qty,
        unitPrice: lineUnitPrice(l),
        design: l.type === "sello" ? l.design : undefined,
      })),
    };
    const link = whatsappLink(buildOrderMessage(lines, { name, phone, notes }, id), whatsappNumber || undefined);
    addOrder(order);
    clear();
    setSent({ id, link });
    window.scrollTo({ top: 0 });
    window.open(link, "_blank", "noopener");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-10">
      <h1 className="text-4xl font-semibold tracking-tight">Tu pedido</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="card rounded-[28px] px-5 sm:px-6">
          <ul className="divide-y divide-line">{lines.map((l) => <CartLineRow key={l.lineId} line={l} />)}</ul>
        </section>
        <form onSubmit={submit} className="card h-fit space-y-4 rounded-[28px] p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft"><span>Artículos</span><span className="tabular-nums">{totals.count}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Envío</span><span>Por coordinar</span></div>
            <div className="flex items-center justify-between border-t border-line pt-3 text-base">
              <span className="flex items-center gap-2 font-medium">Total estimado <DemoBadge label="PRECIOS DEMO" /></span>
              <span className="font-semibold tabular-nums">{formatPrice(totals.total)}</span>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <label className="block">
              <span className="text-sm font-medium">Nombre</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11 w-full rounded-2xl border border-line bg-pearl px-4 outline-none focus:border-lila-deep" autoComplete="name" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Teléfono <span className="font-normal text-ink-mute">(opcional)</span></span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="mt-1.5 h-11 w-full rounded-2xl border border-line bg-pearl px-4 outline-none focus:border-lila-deep" autoComplete="tel" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Notas <span className="font-normal text-ink-mute">(opcional)</span></span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1.5 w-full rounded-2xl border border-line bg-pearl px-4 py-3 outline-none focus:border-lila-deep" />
            </label>
          </div>
          <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1faa59] font-medium text-white transition active:scale-[0.98]">
            <MessageCircle className="size-5" /> Enviar pedido por WhatsApp
          </button>
          <p className="text-xs leading-relaxed text-ink-mute">
            No se realiza ningún pago en línea. El pedido se confirma con la tienda por WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}
