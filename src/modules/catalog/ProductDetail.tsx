"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductPlaceholder } from "@/components/Placeholder";
import { DemoBadge } from "@/components/DemoBadge";
import { formatPrice } from "@/lib/site";
import { getCategory } from "@/lib/data/categories";
import { useCart } from "@/modules/cart/cart-store";
import { availabilityLabel } from "./ProductCard";

export function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);
  const addProduct = useCart((s) => s.addProduct);
  const av = availabilityLabel[product.availability];
  const cat = getCategory(product.categoryId);
  const gallery = product.images.length ? product.images : [null, null, null];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div>
        <div className="card overflow-hidden rounded-[30px]">
          <ProductPlaceholder key={img} categoryId={product.categoryId} className="animate-pop aspect-square w-full" />
        </div>
        <div className="mt-3 flex gap-2">
          {gallery.map((_, i) => (
            <button key={i} onClick={() => setImg(i)} className={`overflow-hidden rounded-2xl ring-2 transition ${img === i ? "ring-ink" : "ring-transparent"}`} aria-label={`Imagen ${i + 1}`}>
              <ProductPlaceholder categoryId={product.categoryId} className="size-16" label={false} />
            </button>
          ))}
        </div>
      </div>
      <div className="lg:pt-6">
        <Link href={`/catalogo?categoria=${product.categoryId}`} className="text-xs font-semibold uppercase tracking-[0.18em] text-lila-deep">{cat?.name}</Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</span>
          {product.demoPrice && <DemoBadge label="PRECIO DEMO" />}
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${av.cls}`}>{av.label}</span>
        </div>
        <p className="mt-5 leading-relaxed text-ink-soft">{product.description}</p>

        {product.variants.length > 0 && (
          <fieldset className="mt-7">
            <legend className="mb-2.5 text-sm font-medium">Variante</legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button key={v.id} onClick={() => setVariant(v.id)} aria-pressed={variant === v.id}
                  className={`rounded-full border px-4 py-2 text-sm transition ${variant === v.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/30"}`}>
                  {v.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-7 flex items-center gap-3">
          <div className="flex h-12 items-center rounded-full border border-line bg-white">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-12 place-items-center" aria-label="Restar"><Minus className="size-4" /></button>
            <span className="w-8 text-center tabular-nums">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid size-12 place-items-center" aria-label="Sumar"><Plus className="size-4" /></button>
          </div>
          <button
            disabled={product.availability === "agotado"}
            onClick={() => {
              addProduct(product.id, variant, qty);
              setAdded(true);
              setTimeout(() => setAdded(false), 1600);
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white transition active:scale-[0.98] disabled:opacity-40"
          >
            {added ? <><Check className="size-4" /> Agregado</> : <><ShoppingBag className="size-4" /> {product.availability === "agotado" ? "Agotado" : "Agregar al carrito"}</>}
          </button>
        </div>
        <p className="mt-6 rounded-2xl bg-mist p-4 text-xs leading-relaxed text-ink-soft">
          Las fotografías, precio y disponibilidad de este producto son de demostración. Se reemplazarán por la información real de la tienda.
        </p>
      </div>
    </div>
  );
}
