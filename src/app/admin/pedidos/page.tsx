"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAdmin } from "@/modules/admin/admin-store";
import { Panel, PageTitle, fmtDate, statusStyle } from "@/modules/admin/AdminShell";
import { shortages } from "@/lib/domain/inventory";
import { describeDesign } from "@/lib/order-message";
import { formatPrice } from "@/lib/site";
import { StampThumb } from "@/modules/configurator/StampThumb";
import type { OrderStatus } from "@/lib/types";

const filters: (OrderStatus | "todos")[] = ["pendiente", "confirmado", "cancelado", "todos"];

export default function OrdersPage() {
  const state = useAdmin();
  const { orders, confirm, cancel } = state;
  const [f, setF] = useState<(typeof filters)[number]>("pendiente");
  const [open, setOpen] = useState<string | null>(null);
  const [askCancel, setAskCancel] = useState<string | null>(null);
  const list = orders.filter((o) => f === "todos" || o.status === f);

  return (
    <>
      <PageTitle title="Pedidos" subtitle="El stock solo se descuenta al confirmar. Cancelar un confirmado devuelve las unidades." />
      <div className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto">
        {filters.map((x) => (
          <button key={x} onClick={() => setF(x)} className={`shrink-0 rounded-full px-4 py-2 text-sm capitalize transition ${f === x ? "bg-ink text-white" : "bg-white ring-1 ring-line"}`}>
            {x} <span className="opacity-50">{x === "todos" ? orders.length : orders.filter((o) => o.status === x).length}</span>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.length === 0 && <Panel><p className="text-sm text-ink-soft">No hay pedidos en este estado.</p></Panel>}
        {list.map((o) => {
          const missing = o.status === "pendiente" ? shortages(state, o) : [];
          const total = o.lines.reduce((t, l) => t + (l.unitPrice ?? 0) * l.qty, 0);
          const isOpen = open === o.id;
          return (
            <Panel key={o.id}>
              <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full items-center gap-3 text-left">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-medium">{o.id} {o.demo && <span className="rounded-full bg-amber-50 px-1.5 text-[10px] font-semibold text-amber-700">DEMO</span>}</p>
                  <p className="truncate text-xs text-ink-mute">{o.customerName}{o.customerPhone ? ` · ${o.customerPhone}` : ""} · {fmtDate(o.createdAt)}</p>
                </div>
                <span className="hidden text-sm tabular-nums sm:block">{formatPrice(total)}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs capitalize ring-1 ${statusStyle[o.status]}`}>{o.status}</span>
                <ChevronDown className={`size-4 text-ink-mute transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="animate-pop mt-4 border-t border-line pt-4">
                  <ul className="space-y-3">
                    {o.lines.map((l, i) => {
                      const d = l.design ? describeDesign(l.design) : null;
                      return (
                        <li key={i} className="flex gap-3 text-sm">
                          {l.design && <StampThumb design={l.design} className="size-16 shrink-0 rounded-xl bg-mist p-1" />}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{l.name} ×{l.qty} <span className="font-normal text-ink-mute">· {l.sku}</span></p>
                            {d && (
                              <div className="mt-1 space-y-0.5 text-xs text-ink-soft">
                                <p>Color: {d.color} · Texto: {d.text}</p>
                                {d.decos.map((x, k) => <p key={k}>• {x}</p>)}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {missing.length > 0 && (
                    <p className="mt-4 rounded-2xl bg-red-50 p-3 text-xs text-red-600">Sin disponibilidad suficiente: {missing.map((m) => `${m.sku} (necesita ${m.required}, hay ${m.available})`).join(", ")}</p>
                  )}
                  {o.confirmedAt && <p className="mt-3 text-xs text-ink-mute">Confirmado: {fmtDate(o.confirmedAt)}</p>}
                  {o.cancelledAt && <p className="mt-1 text-xs text-ink-mute">Cancelado: {fmtDate(o.cancelledAt)}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {o.status === "pendiente" && (
                      <button disabled={missing.length > 0} onClick={() => confirm(o.id)} className="h-10 rounded-full bg-ink px-5 text-sm font-medium text-white disabled:opacity-40">Confirmar y descontar stock</button>
                    )}
                    {o.status !== "cancelado" && askCancel !== o.id && (
                      <button onClick={() => setAskCancel(o.id)} className="h-10 rounded-full px-5 text-sm ring-1 ring-line hover:bg-mist">Cancelar pedido</button>
                    )}
                    {o.status !== "cancelado" && askCancel === o.id && (
                      <div className="animate-pop flex flex-wrap items-center gap-2 rounded-2xl bg-red-50 p-2 pl-3 text-sm text-red-700">
                        {o.status === "confirmado" ? "Las unidades vuelven al inventario." : "¿Cancelar este pedido?"}
                        <button onClick={() => { cancel(o.id); setAskCancel(null); }} className="h-9 rounded-full bg-red-600 px-4 font-medium text-white">Sí, cancelar</button>
                        <button onClick={() => setAskCancel(null)} className="h-9 rounded-full px-3 text-red-700 hover:bg-red-100">No</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </>
  );
}
