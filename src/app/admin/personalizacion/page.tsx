"use client";
import Image from "next/image";
import { useAdmin } from "@/modules/admin/admin-store";
import { Panel, PageTitle } from "@/modules/admin/AdminShell";

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-ink" : "bg-zinc-300"}`}>
      <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function CustomizationPage() {
  const { colors, assets, toggleColor, toggleAsset } = useAdmin();
  const groups = [
    { kind: "figura" as const, title: "Figuras de goma" },
    { kind: "calcomania" as const, title: "Calcomanías" },
  ];
  return (
    <>
      <PageTitle title="Personalización" subtitle="Activa o desactiva lo que aparece en el configurador 3D. Ilustraciones provisionales." />
      <div className="space-y-4">
        <Panel>
          <h2 className="mb-4 font-semibold">Colores del cuerpo</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {colors.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-mist p-3">
                <span className="size-9 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
                <div className="flex-1"><p className="text-sm font-medium">{c.name}</p><p className="text-xs uppercase text-ink-mute">{c.hex}</p></div>
                <Toggle on={c.active} onClick={() => toggleColor(c.id)} label={`Activar ${c.name}`} />
              </li>
            ))}
          </ul>
        </Panel>
        {groups.map((g) => (
          <Panel key={g.kind}>
            <h2 className="mb-4 font-semibold">{g.title}</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {assets.filter((a) => a.kind === g.kind).map((a) => (
                <li key={a.id} className={`flex items-center gap-3 rounded-2xl bg-mist p-3 transition ${a.active ? "" : "opacity-60"}`}>
                  <Image src={a.src} alt="" width={44} height={44} className="size-11" />
                  <div className="flex-1"><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-ink-mute">{a.widthCm} × {a.heightCm} cm (ref.)</p></div>
                  <Toggle on={a.active} onClick={() => toggleAsset(a.id)} label={`Activar ${a.name}`} />
                </li>
              ))}
            </ul>
          </Panel>
        ))}
        <Panel>
          <h2 className="font-semibold">Elementos decorativos</h2>
          <p className="mt-1 text-sm text-ink-soft">Próximamente: carga de nuevos recursos SVG/PNG transparentes con su tamaño físico. Requiere gestión de imágenes y base de datos.</p>
        </Panel>
      </div>
    </>
  );
}
