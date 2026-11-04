"use client";
import { useState } from "react";
import { useAdmin } from "@/modules/admin/admin-store";
import { Panel, PageTitle } from "@/modules/admin/AdminShell";

export default function SettingsPage() {
  const { settings, updateSettings, resetDemo } = useAdmin();
  const [wa, setWa] = useState(settings.whatsappNumber);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageTitle title="Configuración" subtitle="Ajustes generales (guardados solo en este navegador durante la demo)." />
      <div className="space-y-4">
        <Panel>
          <form onSubmit={(e) => { e.preventDefault(); updateSettings({ whatsappNumber: wa.replace(/\D/g, "") }); setSaved(true); setTimeout(() => setSaved(false), 1500); }} className="max-w-md space-y-3">
            <h2 className="font-semibold">WhatsApp para pedidos</h2>
            <label className="block">
              <span className="text-sm text-ink-soft">Número internacional sin “+” (ej. 5939XXXXXXXX)</span>
              <input value={wa} onChange={(e) => setWa(e.target.value)} inputMode="tel" className="mt-1.5 h-11 w-full rounded-2xl bg-mist px-4 outline-none ring-1 ring-transparent focus:ring-lila-deep" />
            </label>
            <button className="h-10 rounded-full bg-ink px-5 text-sm font-medium text-white">{saved ? "Guardado ✓" : "Guardar"}</button>
          </form>
        </Panel>
        <Panel>
          <h2 className="font-semibold">Acceso administrativo</h2>
          <p className="mt-1 text-sm text-ink-soft">Pendiente: inicio de sesión para una sola persona administradora. Hasta entonces este panel no está protegido y no debe contener datos reales.</p>
        </Panel>
        <Panel>
          <h2 className="font-semibold">Datos de demostración</h2>
          <p className="mt-1 text-sm text-ink-soft">Restablece inventario, pedidos, movimientos y personalización a los valores DEMO iniciales.</p>
          <button onClick={() => window.confirm("¿Restablecer todos los datos DEMO?") && resetDemo()} className="mt-3 h-10 rounded-full px-5 text-sm text-red-600 ring-1 ring-red-200 hover:bg-red-50">Restablecer demo</button>
        </Panel>
      </div>
    </>
  );
}
