import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getProduct, products } from "@/lib/data/products";
import { ProductDetail } from "@/modules/catalog/ProductDetail";
import { ProductCard } from "@/modules/catalog/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  return { title: p?.name ?? "Producto" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3);
  return (
    <div className="mx-auto max-w-6xl px-5 pt-8">
      <Link href="/catalogo" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"><ChevronLeft className="size-4" /> Catálogo</Link>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">También te puede gustar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
}
