"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

export function CatalogView() {
  const params = useSearchParams();
  const router = useRouter();
  const active = params.get("categoria") ?? "todas";
  const [q, setQ] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p: Product) =>
        (active === "todas" || p.categoryId === active) &&
        (!onlyAvailable || p.availability !== "agotado") &&
        (!term || `${p.name} ${p.description}`.toLowerCase().includes(term)),
    );
  }, [active, q, onlyAvailable]);

  const setCat = (id: string) => router.replace(id === "todas" ? "/catalogo" : `/catalogo?categoria=${id}`, { scroll: false });

  return (
    <div>
      <div className="sticky top-[76px] z-30 -mx-5 mb-8 px-5">
        <div className="glass flex flex-col gap-3 rounded-[24px] p-2 sm:flex-row sm:items-center">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {[{ id: "todas", short: "Todo" }, ...categories].map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-sm transition-all ${active === c.id ? "bg-ink text-white" : "text-ink-soft hover:bg-black/[0.05]"}`}
              >
                {c.short}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <label className="flex h-10 flex-1 items-center gap-2 rounded-full bg-white/80 px-3.5 ring-1 ring-line sm:w-56 sm:flex-none">
              <Search className="size-4 text-ink-mute" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" className="w-full bg-transparent text-sm outline-none" aria-label="Buscar productos" />
            </label>
            <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full px-3 text-sm text-ink-soft">
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="accent-lila-deep" />
              Disponibles
            </label>
          </div>
        </div>
      </div>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="py-20 text-center text-ink-soft">No encontramos productos con esos filtros.</p>
      )}
    </div>
  );
}
