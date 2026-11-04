"use client";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useAdmin } from "@/modules/admin/admin-store";
import { Panel, PageTitle, fmtDate, statusStyle } from "@/modules/admin/AdminShell";
import { formatPrice } from "@/lib/site";

export default function AdminHome() {
  const { orders, inventory, movements, colors, assets } = useAdmin();
  const pending = orders.filter((o) => o.status === "pendiente");
  const confirmed = orders.filter((o) => o.status === "confirmado");
  const low = inventory.filter((i) => i.qty <= 3);
  const confirmedValue = confirmed.reduce((t, o) => t + o.lines.reduce((s, l) => s + (l.unitPrice ?? 0) * l.qty, 0), 0);
  const stats = [
    { label: "Pedidos pendientes", value: pending.length, href: "/admin/pedidos" },
    { label: "Pedidos confirmados", value: confirmed.length, href: "/admin/pedidos" },
    { label: "Artículos con stock bajo", value: low.length, href: "/admin/inventario" },
    { label: "Valor confirmado (DEMO)", value: formatPrice(confirmedValue), href: "/admin/pedidos" },
  ];
  return (
    <>
      <PageTitle title="Resumen" subtitle="Vista general de la tienda (datos de demostración)." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-[24px] bg-white p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-xs text-ink-mute">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums sm:text-3xl">{s.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Pedidos recientes</h2><Link href="/admin/pedidos" className="flex items-center gap-1 text-sm text-ink-soft">Ver <ArrowRight className="size-3.5" /></Link></div>
          <ul className="divide-y divide-line">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0"><p className="font-medium">{o.id}</p><p className="truncate text-xs text-ink-mute">{o.customerName} · {fmtDate(o.createdAt)}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${statusStyle[o.status]}`}>{o.status}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-semibold">Stock bajo</h2>
          {low.length ? (
            <ul className="divide-y divide-line">
              {low.map((i) => (
                <li key={i.sku} className="flex items-center justify-between py-3 text-sm">
                  <span className="flex items-center gap-2"><AlertTriangle className={`size-4 ${i.qty === 0 ? "text-red-500" : "text-amber-500"}`} />{i.name}</span>
                  <span className="tabular-nums text-ink-soft">{i.qty} u.</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-ink-soft">Todo en orden.</p>}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center text-xs text-ink-soft">
            <div><p className="text-lg font-semibold text-ink">{colors.filter((c) => c.active).length}</p>colores activos</div>
            <div><p className="text-lg font-semibold text-ink">{assets.filter((a) => a.active).length}</p>decoraciones</div>
            <div><p className="text-lg font-semibold text-ink">{movements.length}</p>movimientos</div>
          </div>
        </Panel>
      </div>
    </>
  );
}
