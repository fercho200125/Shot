import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductPlaceholder } from "@/components/Placeholder";
import { DemoBadge } from "@/components/DemoBadge";
import { formatPrice } from "@/lib/site";
import { getCategory } from "@/lib/data/categories";

export const availabilityLabel: Record<Product["availability"], { label: string; cls: string }> = {
  disponible: { label: "Disponible", cls: "bg-emerald-50 text-emerald-700" },
  "bajo-pedido": { label: "Bajo pedido", cls: "bg-lila-soft text-lila-deep" },
  agotado: { label: "Agotado", cls: "bg-zinc-100 text-zinc-500" },
};

export function ProductCard({ product }: { product: Product }) {
  const av = availabilityLabel[product.availability];
  const href = product.configurable ? "/configurador" : `/catalogo/${product.slug}`;
  return (
    <Link href={href} className="card group flex flex-col overflow-hidden rounded-[26px] transition-all duration-500 ease-[var(--ease-fluid)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(23_21_28/0.25)]">
      <div className="relative aspect-[4/3.4] overflow-hidden">
        <ProductPlaceholder categoryId={product.categoryId} className="size-full transition-transform duration-700 group-hover:scale-[1.04]" />
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${av.cls}`}>{av.label}</span>
        {product.configurable && (
          <span className="glass absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium">
            <Sparkles className="size-3" /> Configurable 3D
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-mute">{getCategory(product.categoryId)?.short}</p>
        <h3 className="mt-1 text-[16px] font-medium leading-snug">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="flex items-center gap-2 font-semibold tabular-nums">
            {product.configurable ? <span className="text-sm font-normal text-ink-soft">Desde</span> : null}
            {formatPrice(product.price)}
            {product.demoPrice && <DemoBadge />}
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-mist transition-colors group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
