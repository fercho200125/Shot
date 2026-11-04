"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/modules/cart/cart-store";
import { useHydrated } from "@/lib/use-hydrated";

const nav = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#categorias", label: "Categorías" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#faq", label: "Preguntas" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const setOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-4 transition-all duration-500 ${
          scrolled || menu ? "glass" : "border border-transparent"
        }`}
      >
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-[14px] text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Link
            href="/configurador"
            className="hidden h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[14px] font-medium text-white transition hover:bg-ink/90 sm:inline-flex"
          >
            <Sparkles className="size-4" /> Diseña tu sello
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative grid size-10 place-items-center rounded-full transition hover:bg-black/[0.05]"
            aria-label={`Abrir carrito${hydrated && count ? `, ${count} productos` : ""}`}
          >
            <ShoppingBag className="size-5" strokeWidth={1.7} />
            {hydrated && count > 0 && (
              <span key={count} className="animate-pop absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-lila-deep px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setMenu((m) => !m)} className="grid size-10 place-items-center rounded-full hover:bg-black/[0.05] md:hidden" aria-label="Menú" aria-expanded={menu}>
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <div className={`mx-auto max-w-6xl overflow-hidden transition-all duration-500 ease-[var(--ease-fluid)] md:hidden ${menu ? "mt-2 max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="glass flex flex-col rounded-3xl p-2" aria-label="Móvil">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="rounded-2xl px-4 py-3 text-[15px] hover:bg-black/[0.04]">
              {n.label}
            </Link>
          ))}
          <Link href="/configurador" className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-[15px] font-medium text-white">
            <Sparkles className="size-4" /> Diseña tu sello en 3D
          </Link>
        </nav>
      </div>
    </header>
  );
}
