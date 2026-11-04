"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Boxes, LayoutDashboard, Palette, Settings, ShieldAlert, ShoppingCart, Store } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useHydrated } from "@/lib/use-hydrated";
import { useAdmin } from "./admin-store";
import { useEffect } from "react";

const nav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/personalizacion", label: "Personalización", icon: Palette },
  { href: "/admin/movimientos", label: "Movimientos", icon: ArrowLeftRight },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const hydrated = useHydrated();
  const error = useAdmin((s) => s.lastError);
  const clearError = useAdmin((s) => s.clearError);
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 4500);
    return () => clearTimeout(t);
  }, [error, clearError]);

  return (
    <div className="min-h-dvh bg-mist">
      <div className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-center text-xs text-amber-800">
        <ShieldAlert className="size-3.5 shrink-0" /> Panel en modo DEMO: datos locales de este navegador, sin base de datos ni autenticación todavía.
      </div>
      <div className="mx-auto flex max-w-7xl gap-6 px-3 py-4 sm:px-5 lg:py-6">
        <aside className="sticky top-6 hidden h-[calc(100dvh-5rem)] w-60 shrink-0 flex-col rounded-[28px] bg-white p-4 ring-1 ring-line lg:flex">
          <div className="px-2 pb-6 pt-1"><Logo /></div>
          <nav className="space-y-1">
            {nav.map((n) => {
              const on = path === n.href;
              return (
                <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${on ? "bg-ink text-white" : "text-ink-soft hover:bg-mist hover:text-ink"}`}>
                  <n.icon className="size-[18px]" strokeWidth={1.7} /> {n.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/" className="mt-auto flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-ink-soft hover:bg-mist"><Store className="size-[18px]" strokeWidth={1.7} /> Ver tienda</Link>
        </aside>
        <div className="min-w-0 flex-1 pb-24 lg:pb-0">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Logo />
            <Link href="/" className="rounded-full bg-white px-3 py-2 text-xs ring-1 ring-line">Ver tienda</Link>
          </div>
          {hydrated ? children : <div className="h-96 animate-pulse rounded-[28px] bg-white/60" />}
        </div>
      </div>
      {/* Navegación inferior móvil */}
      <nav className="glass fixed inset-x-3 bottom-3 z-40 flex justify-between rounded-full p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:hidden">
        {nav.map((n) => {
          const on = path === n.href;
          return (
            <Link key={n.href} href={n.href} aria-label={n.label} className={`grid h-11 flex-1 place-items-center rounded-full transition ${on ? "bg-ink text-white" : "text-ink-soft"}`}>
              <n.icon className="size-5" strokeWidth={1.7} />
            </Link>
          );
        })}
      </nav>
      {error && (
        <div role="alert" className="animate-pop fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-sm text-white shadow-xl lg:bottom-6">
          {error}
        </div>
      )}
    </div>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`rounded-[24px] bg-white p-5 ring-1 ring-line ${className}`}>{children}</section>
);

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export const statusStyle = {
  pendiente: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmado: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelado: "bg-zinc-100 text-zinc-500 ring-zinc-200",
} as const;
