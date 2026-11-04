"use client";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useAdmin } from "@/modules/admin/admin-store";
import { Panel, PageTitle } from "@/modules/admin/AdminShell";
import type { InventoryItem } from "@/lib/types";

function AdjustDialog({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const adjust = useAdmin((s) => s.adjust);
  const [qty, setQty] = useState(item.qty);
  const [note, setNote] = useState("");
  const diff = qty - item.qty;
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-3 backdrop-blur-[2px] sm:place-items-center" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); if (adjust(item.sku, qty, note)) onClose(); }}
        className="animate-pop w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div><h2 className="text-lg font-semibold">Ajustar inventario</h2><p className="text-sm text-ink-soft">{item.name} · {item.sku}</p></div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-mist" aria-label="Cerrar"><X className="size-5" /></button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-mist p-3"><p className="text-xs text-ink-mute">Anterior</p><p className="text-xl font-semibold tabular-nums">{item.qty}</p></div>
          <div className="rounded-2xl bg-mist p-3"><p className="text-xs text-ink-mute">Nueva</p><p className="text-xl font-semibold tabular-nums">{qty}</p></div>
          <div className={`rounded-2xl p-3 ${diff > 0 ? "bg-emerald-50 text-emerald-700" : diff < 0 ? "bg-red-50 text-red-600" : "bg-mist"}`}><p className="text-xs opacity-70">Diferencia</p><p className="text-xl font-semibold tabular-nums">{diff > 0 ? `+${diff}` : diff}</p></div>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button type="button" onClick={() => setQty((q) => Math.max(0, q - 1))} className="grid size-12 place-items-center rounded-full ring-1 ring-line" aria-label="Restar"><Minus className="size-4" /></button>
          <input type="number" min={0} value={qty} onChange={(e) => setQty(Math.max(0, Math.floor(Number(e.target.value) || 0)))} className="h-12 flex-1 rounded-full bg-mist text-center text-lg tabular-nums outline-none" aria-label="Cantidad nueva" />
          <button type="button" onClick={() => setQty((q) => q + 1)} className="grid size-12 place-items-center rounded-full ring-1 ring-line" aria-label="Sumar"><Plus className="size-4" /></button>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-medium">Motivo del ajuste</span>
          <input required value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. conteo físico, merma, reposición" className="mt-1.5 h-11 w-full rounded-2xl bg-mist px-4 outline-none ring-1 ring-transparent focus:ring-lila-deep" />
        </label>
        <p className="mt-3 text-xs text-ink-mute">Se registrará con fecha y hora actuales en Movimientos.</p>
        <button disabled={diff === 0 || !note.trim()} className="mt-5 h-12 w-full rounded-full bg-ink font-medium text-white disabled:opacity-40">Guardar ajuste</button>
      </form>
    </div>
  );
}

export default function InventoryPage() {
  const inventory = useAdmin((s) => s.inventory);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [q, setQ] = useState("");
  const list = inventory.filter((i) => `${i.name} ${i.sku}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageTitle title="Inventario" subtitle="Cantidades DEMO. Los ajustes manuales quedan registrados." action={
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="h-10 w-48 rounded-full bg-white px-4 text-sm outline-none ring-1 ring-line" />
      } />
      <Panel className="p-0 sm:p-0">
        <ul className="divide-y divide-line">
          {list.map((i) => (
            <li key={i.sku} className="flex items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{i.name}</p>
                <p className="text-xs text-ink-mute">{i.sku}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-sm tabular-nums ${i.qty === 0 ? "bg-red-50 text-red-600" : i.qty <= 3 ? "bg-amber-50 text-amber-700" : "bg-mist"}`}>{i.qty} u.</span>
              <button onClick={() => setEditing(i)} className="h-9 rounded-full px-4 text-sm ring-1 ring-line hover:bg-mist">Ajustar</button>
            </li>
          ))}
        </ul>
      </Panel>
      {editing && <AdjustDialog item={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
