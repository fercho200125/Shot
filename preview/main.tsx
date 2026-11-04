import "./fix-assets";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useRoute } from "./router";
import { Header } from "@/modules/store/Header";
import { Footer } from "@/modules/store/Footer";
import { CartDrawer } from "@/modules/cart/CartDrawer";
import { AdminShell } from "@/modules/admin/AdminShell";
import { Configurator } from "@/modules/configurator/Configurator";
import { ProductDetail } from "@/modules/catalog/ProductDetail";
import { ProductCard } from "@/modules/catalog/ProductCard";
import { getProduct, products } from "@/lib/data/products";
import Link from "./shims/link";
import HomePage from "@/app/(store)/page";
import CatalogPage from "@/app/(store)/catalogo/page";
import CartPage from "@/app/(store)/carrito/page";
import AdminHome from "@/app/admin/page";
import InventoryPage from "@/app/admin/inventario/page";
import OrdersPage from "@/app/admin/pedidos/page";
import CustomizationPage from "@/app/admin/personalizacion/page";
import MovementsPage from "@/app/admin/movimientos/page";
import SettingsPage from "@/app/admin/configuracion/page";

const adminPages: Record<string, () => React.ReactNode> = {
  "": () => <AdminHome />,
  inventario: () => <InventoryPage />,
  pedidos: () => <OrdersPage />,
  personalizacion: () => <CustomizationPage />,
  movimientos: () => <MovementsPage />,
  configuracion: () => <SettingsPage />,
};

function ProductRoute({ slug }: { slug: string }) {
  const product = getProduct(slug);
  if (!product) return <p className="py-24 text-center text-ink-soft">Producto no encontrado.</p>;
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3);
  return (
    <div className="mx-auto max-w-6xl px-5 pt-8">
      <Link href="/catalogo" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">‹ Catálogo</Link>
      <ProductDetail key={product.id} product={product} />
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">También te puede gustar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
}

function Store({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  const r = useRoute();
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", r.name === "configurador" ? "#0d0d10" : "#f7f6f4");
  }, [r.name]);
  useEffect(() => {
    if (r.anchor) requestAnimationFrame(() => document.getElementById(r.anchor!)?.scrollIntoView());
    // solo al cargar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let page: React.ReactNode;
  switch (r.name) {
    case "configurador":
      page = <Configurator />;
      break;
    case "admin":
      page = <AdminShell>{(adminPages[r.adminPage ?? ""] ?? adminPages[""])()}</AdminShell>;
      break;
    case "catalogo":
      page = <Store><CatalogPage /></Store>;
      break;
    case "producto":
      page = <Store><ProductRoute slug={r.slug!} /></Store>;
      break;
    case "carrito":
      page = <Store><CartPage /></Store>;
      break;
    default:
      page = <Store><HomePage /></Store>;
  }
  return (
    <>
      {page}
      <CartDrawer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
