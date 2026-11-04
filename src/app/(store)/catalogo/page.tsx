import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/modules/catalog/CatalogView";
import { DemoBadge } from "@/components/DemoBadge";

export const metadata: Metadata = { title: "Catálogo" };

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lila-deep">Catálogo</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Todo para personalizar</h1>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-ink-soft">
          Productos, precios y disponibilidad de demostración <DemoBadge />
        </p>
      </div>
      <Suspense>
        <CatalogView />
      </Suspense>
    </div>
  );
}
