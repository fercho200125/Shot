"use client";
import { useAdmin } from "@/modules/admin/admin-store";
import { Panel, PageTitle, fmtDate } from "@/modules/admin/AdminShell";

const reasonLabel = { "ajuste-manual": "Ajuste manual", "pedido-confirmado": "Pedido confirmado", "pedido-cancelado": "Pedido cancelado" } as const;

export default function MovementsPage() {
  const movements = useAdmin((s) => s.movements);
  const inventory = useAdmin((s) => s.inventory);
  const name = (sku: string) => inventory.find((i) => i.sku === sku)?.name ?? sku;
  return (
    <>
      <PageTitle title="Movimientos" subtitle="Historial de cambios de inventario. No se borra al cancelar pedidos." />
      <Panel className="overflow-x-auto p-0 sm:p-0">
        {movements.length === 0 ? (
          <p className="p-5 text-sm text-ink-soft">Aún no hay movimientos. Ajusta el inventario o confirma un pedido.</p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs text-ink-mute">
              <tr className="border-b border-line">
                {["Fecha y hora", "Artículo", "Anterior", "Nueva", "Diferencia", "Motivo"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {movements.map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap px-5 py-3 text-ink-soft">{fmtDate(m.at)}</td>
                  <td className="px-5 py-3">{name(m.sku)}<span className="block text-xs text-ink-mute">{m.sku}</span></td>
                  <td className="px-5 py-3 tabular-nums">{m.previousQty}</td>
                  <td className="px-5 py-3 tabular-nums">{m.newQty}</td>
                  <td className={`px-5 py-3 font-medium tabular-nums ${m.difference > 0 ? "text-emerald-600" : "text-red-600"}`}>{m.difference > 0 ? `+${m.difference}` : m.difference}</td>
                  <td className="px-5 py-3">{reasonLabel[m.reason]}{m.orderId ? ` · ${m.orderId}` : ""}{m.note && <span className="block text-xs text-ink-mute">{m.note}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  );
}
