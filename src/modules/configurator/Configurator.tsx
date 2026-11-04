"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Check, ChevronDown, ChevronLeft, Palette, Plus, Redo2, RotateCcw, RotateCw, ShoppingBag, Smile, Sticker, Trash2, Type, Undo2, X,
} from "lucide-react";
import type { DecorationKind, StampDesign } from "@/lib/types";
import { surfaceOrder, surfaces, stampSpec } from "@/lib/stamp-spec";
import { formatPrice } from "@/lib/site";
import { getProduct, STAMP_PRODUCT_ID } from "@/lib/data/products";
import { useAdmin } from "@/modules/admin/admin-store";
import { useCart } from "@/modules/cart/cart-store";
import { assetById, useDesign } from "./design-store";
import { PrintPreview, fontFamilies } from "./PrintPreview";

const StampScene = dynamic(() => import("./three/StampScene").then((m) => m.StampScene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="size-10 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
    </div>
  ),
});

type Tab = "color" | "figura" | "calcomania" | "texto";
const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: "color", label: "Color", icon: Palette },
  { id: "figura", label: "Figuras", icon: Smile },
  { id: "calcomania", label: "Calcomanías", icon: Sticker },
  { id: "texto", label: "Texto", icon: Type },
];

/* ------------------------------ Piezas ------------------------------ */

function IconBtn({ onClick, disabled, label, children, className = "" }: { onClick: () => void; disabled?: boolean; label: string; children: React.ReactNode; className?: string }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={`grid size-10 place-items-center rounded-full text-white/85 transition-all hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent ${className}`}>
      {children}
    </button>
  );
}

function HistoryControls() {
  const undo = useDesign((s) => s.undo);
  const redo = useDesign((s) => s.redo);
  const canUndo = useDesign((s) => s.past.length > 0);
  const canRedo = useDesign((s) => s.future.length > 0);
  return (
    <div className="glass-dark flex rounded-full p-1">
      <IconBtn onClick={undo} disabled={!canUndo} label="Deshacer"><Undo2 className="size-[18px]" /></IconBtn>
      <IconBtn onClick={redo} disabled={!canRedo} label="Rehacer"><Redo2 className="size-[18px]" /></IconBtn>
    </div>
  );
}

function SurfaceSwitcher() {
  const surface = useDesign((s) => s.surface);
  const setSurface = useDesign((s) => s.setSurface);
  const counts = useDesign((s) => s.present.decorations).reduce<Record<string, number>>((m, d) => ((m[d.surface] = (m[d.surface] ?? 0) + 1), m), {});
  return (
    <div className="glass-dark flex rounded-full p-1" role="tablist" aria-label="Superficie a decorar">
      {surfaceOrder.map((id) => (
        <button key={id} role="tab" aria-selected={surface === id} onClick={() => setSurface(id)}
          className={`relative h-9 rounded-full px-3.5 text-[13px] font-medium transition-all duration-300 ${surface === id ? "bg-white text-ink shadow" : "text-white/70 hover:text-white"}`}>
          {surfaces[id].label}
          {counts[id] ? <span className={`ml-1.5 text-[11px] tabular-nums ${surface === id ? "text-ink/50" : "text-white/40"}`}>{counts[id]}</span> : null}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ size = "lg" }: { size?: "lg" | "sm" }) {
  const colors = useAdmin((s) => s.colors).filter((c) => c.active);
  const colorId = useDesign((s) => s.present.colorId);
  const setColor = useDesign((s) => s.setColor);
  const big = size === "lg";
  return (
    <div className={big ? "grid grid-cols-4 gap-3" : "flex flex-col gap-2.5"} role="radiogroup" aria-label="Color del cuerpo">
      {colors.map((c) => {
        const on = c.id === colorId;
        return (
          <button key={c.id} role="radio" aria-checked={on} aria-label={c.name} onClick={() => setColor(c.id)} className="group flex flex-col items-center gap-2">
            <span className={`relative grid place-items-center rounded-full transition-all duration-300 ${big ? "size-14" : "size-9"} ${on ? "ring-2 ring-white ring-offset-2 ring-offset-[#1c1c22]" : "ring-1 ring-white/15 group-hover:scale-105"}`}
              style={{ background: `radial-gradient(circle at 32% 28%, rgb(255 255 255 / .55) 0, transparent 42%), ${c.hex}` }}>
              {on && <Check className={`${big ? "size-5" : "size-4"} text-ink/70`} strokeWidth={2.5} />}
            </span>
            {big && <span className={`text-xs ${on ? "text-white" : "text-white/55"}`}>{c.name}</span>}
          </button>
        );
      })}
    </div>
  );
}

function AssetGrid({ kind, layout }: { kind: DecorationKind; layout: "grid" | "row" }) {
  const assets = useAdmin((s) => s.assets).filter((a) => a.kind === kind && a.active);
  const add = useDesign((s) => s.add);
  const surface = useDesign((s) => s.surface);
  return (
    <div>
      {layout === "grid" && (
        <p className="mb-3 text-xs text-white/50">Toca para colocar en <b className="font-medium text-white/80">{surfaces[surface].label}</b>. Luego arrástralo sobre el sello.</p>
      )}
      <div className={layout === "grid" ? "grid grid-cols-3 gap-2.5" : "no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4"}>
        {assets.map((a) => (
          <button key={a.id} onClick={() => add(a)}
            className={`group relative flex shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-white/[0.06] p-2.5 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.1] active:scale-95 ${layout === "row" ? "w-[76px]" : ""}`}>
            <Image src={a.src} alt="" width={64} height={64} className="size-12 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-6 sm:size-14" />
            <span className="text-[11px] text-white/70">{a.name}</span>
            <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100"><Plus className="size-3 text-white" /></span>
          </button>
        ))}
      </div>
      {layout === "grid" && (
        <p className="mt-3 text-[11px] leading-relaxed text-white/40">Tamaño fijo ≈ {assets[0]?.widthCm ?? 1.5} cm. Ilustraciones provisionales 2D.</p>
      )}
    </div>
  );
}

function TextEditor({ compact = false }: { compact?: boolean }) {
  const lines = useDesign((s) => s.present.printLines);
  const font = useDesign((s) => s.present.printFont);
  const setLine = useDesign((s) => s.setPrintLine);
  const setFont = useDesign((s) => s.setPrintFont);
  const [visible, setVisible] = useState(() => Math.max(1, lines.reduce((n, l, i) => (l.trim() ? i + 1 : n), 0)));
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-[#f4f1ea] p-1.5 shadow-inner">
        <PrintPreview lines={lines} font={font} className="w-full rounded-xl" />
      </div>
      <p className="text-[11px] leading-relaxed text-white/45">Esto es lo que imprime el sello en el papel. No forma parte de la decoración del cuerpo.</p>
      <div className="space-y-2">
        {lines.slice(0, visible).map((l, i) => (
          <input key={i} value={l} onChange={(e) => setLine(i, e.target.value)} maxLength={32}
            placeholder={i === 0 ? "Ej. Dr. Carlos Pérez" : `Línea ${i + 1}`} aria-label={`Línea ${i + 1} del texto`}
            className={`h-11 w-full rounded-xl bg-white/[0.07] px-3.5 text-[15px] text-white outline-none ring-1 ring-white/10 transition placeholder:text-white/30 focus:bg-white/[0.1] focus:ring-lila ${i === 0 ? "font-medium" : ""}`} />
        ))}
        {visible < lines.length && (
          <button onClick={() => setVisible((v) => v + 1)} className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] text-white/70 hover:bg-white/10">
            <Plus className="size-3.5" /> Agregar línea
          </button>
        )}
      </div>
      <div className={`grid grid-cols-3 gap-1.5 rounded-full bg-white/[0.06] p-1 ${compact ? "" : "mt-2"}`} role="radiogroup" aria-label="Tipografía">
        {(Object.keys(fontFamilies) as StampDesign["printFont"][]).map((f) => (
          <button key={f} role="radio" aria-checked={font === f} onClick={() => setFont(f)}
            className={`h-9 rounded-full text-[13px] transition ${font === f ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}
            style={{ fontFamily: fontFamilies[f].css }}>
            {fontFamilies[f].label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Herramientas contextuales del elemento seleccionado. */
function SelectionTools({ className = "" }: { className?: string }) {
  const selected = useDesign((s) => s.selected);
  const d = useDesign((s) => s.present.decorations.find((x) => x.uid === s.selected));
  const rotate = useDesign((s) => s.rotate);
  const begin = useDesign((s) => s.begin);
  const commit = useDesign((s) => s.commit);
  const remove = useDesign((s) => s.remove);
  const select = useDesign((s) => s.select);
  if (!selected || !d) return null;
  const a = assetById(d.assetId);
  const signed = d.rotation > 180 ? d.rotation - 360 : d.rotation;
  return (
    <div key={selected} className={`glass-dark animate-pop flex items-center gap-1 rounded-full p-1.5 pl-2 ${className}`}>
      {a && <Image src={a.src} alt="" width={28} height={28} className="size-7" />}
      <IconBtn onClick={() => rotate(d.uid, d.rotation - 15)} label="Girar a la izquierda"><RotateCcw className="size-[18px]" /></IconBtn>
      <input type="range" min={-180} max={180} step={1} value={signed} aria-label="Rotación"
        onPointerDown={begin} onPointerUp={commit} onKeyUp={commit} onBlur={commit}
        onChange={(e) => { begin(); rotate(d.uid, Number(e.target.value), true); }}
        className="w-20 accent-white sm:w-28" />
      <span className="w-9 text-center text-[11px] tabular-nums text-white/60">{signed}°</span>
      <IconBtn onClick={() => rotate(d.uid, d.rotation + 15)} label="Girar a la derecha"><RotateCw className="size-[18px]" /></IconBtn>
      <span className="mx-0.5 h-5 w-px bg-white/15" />
      <IconBtn onClick={() => remove(d.uid)} label="Eliminar" className="hover:!bg-red-500/20 hover:text-red-300"><Trash2 className="size-[18px]" /></IconBtn>
      <IconBtn onClick={() => select(null)} label="Listo"><Check className="size-[18px]" /></IconBtn>
    </div>
  );
}

function Toast() {
  const fb = useDesign((s) => s.feedback);
  if (!fb) return null;
  return (
    <div key={fb.nonce} className="animate-toast pointer-events-none fixed left-1/2 top-[72px] z-50 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-ink shadow-xl">
      {fb.text}
    </div>
  );
}

function useAddToCart() {
  const addStamp = useCart((s) => s.addStamp);
  const select = useDesign((s) => s.select);
  return () => {
    select(null);
    addStamp(useDesign.getState().present);
  };
}

function useKeyboard() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      const s = useDesign.getState();
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) s.redo(); else s.undo(); return; }
      if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); s.redo(); return; }
      const d = s.present.decorations.find((x) => x.uid === s.selected);
      if (!d) return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); s.remove(d.uid); }
      if (e.key === "Escape") s.select(null);
      const step = e.shiftKey ? 0.5 : 0.1;
      const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      if (delta[e.key]) { e.preventDefault(); s.begin(); s.move(d.uid, d.x + delta[e.key][0], d.y + delta[e.key][1]); s.commit(); }
      if (e.key === "r" || e.key === "R") s.rotate(d.uid, d.rotation + (e.shiftKey ? -15 : 15));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/* --------------------------- Configurador --------------------------- */

export function Configurator() {
  const [tab, setTab] = useState<Tab>("figura");
  const [sheetOpen, setSheetOpen] = useState(false);
  const select = useDesign((s) => s.select);
  const selected = useDesign((s) => s.selected);
  const count = useDesign((s) => s.present.decorations.length);
  const setSurface = useDesign((s) => s.setSurface);
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const setCartOpen = useCart((s) => s.setOpen);
  const addToCart = useAddToCart();
  const product = useMemo(() => getProduct(STAMP_PRODUCT_ID), []);
  useKeyboard();

  // Vista inicial animada hacia el frente.
  useEffect(() => {
    const t = setTimeout(() => setSurface("frente"), 250);
    return () => clearTimeout(t);
  }, [setSurface]);

  const priceTag = (onLight: boolean) => (
    <span className="flex items-center gap-1.5 tabular-nums">
      {formatPrice(product?.price ?? null)}
      {product?.demoPrice && (
        <span className={`rounded-full px-1.5 py-px text-[9px] font-semibold tracking-wider ${onLight ? "bg-amber-100 text-amber-700" : "bg-amber-300/20 text-amber-200"}`}>DEMO</span>
      )}
    </span>
  );

  const panelContent = (t: Tab, layout: "grid" | "row") =>
    t === "color" ? <ColorPicker /> : t === "texto" ? <TextEditor compact={layout === "row"} /> : <AssetGrid kind={t} layout={layout} />;

  const mobileExpanded = sheetOpen || tab === "texto";

  return (
    <div className="studio-bg fixed inset-0 overflow-hidden text-white">
      <Toast />

      {/* ----- Barra superior ----- */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] lg:px-5">
        <div className="flex items-center gap-2">
          <Link href="/" className="glass-dark grid size-11 place-items-center rounded-full" aria-label="Volver a la tienda"><ChevronLeft className="size-5" /></Link>
          <div className="hidden leading-tight sm:block">
            <p className="text-[15px] font-semibold">Diseña tu sello</p>
            <p className="text-xs text-white/50">Sello automático · {stampSpec.width} × {stampSpec.height} × {stampSpec.depth} cm aprox.</p>
          </div>
        </div>
        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block"><SurfaceSwitcher /></div>
        <div className="flex items-center gap-2">
          <HistoryControls />
          <button onClick={() => setCartOpen(true)} className="glass-dark relative grid size-11 place-items-center rounded-full" aria-label="Ver carrito">
            <ShoppingBag className="size-[18px]" />
            {cartCount > 0 && <span key={cartCount} className="animate-pop absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-lila px-1 text-[11px] font-semibold text-ink">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* ----- Lienzo 3D: tamaño fijo (no se redimensiona con los paneles) ----- */}
      <div className="absolute inset-x-0 top-0 bottom-[calc(248px+env(safe-area-inset-bottom))] lg:bottom-0 lg:right-[400px]">
        <StampScene onMissed={() => select(null)} />
        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] text-white/35 lg:bottom-6">
          {selected ? "Arrastra para mover · usa las herramientas para girar" : "Desliza para girar 360°"}
        </p>
        {/* Selector de superficie (móvil) */}
        <div className="absolute inset-x-0 top-[calc(max(0.75rem,env(safe-area-inset-top))+56px)] flex justify-center lg:hidden"><SurfaceSwitcher /></div>
        {/* Colores flotantes (móvil) */}
        <div className="glass-dark absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 lg:hidden"><ColorPicker size="sm" /></div>
        {/* Herramientas contextuales */}
        <div className="absolute inset-x-0 bottom-10 flex justify-center px-3 lg:bottom-14"><SelectionTools /></div>
        {/* Vista previa en papel (escritorio) */}
        {tab !== "texto" && (
          <div className="glass-dark absolute bottom-6 left-6 hidden w-72 rounded-3xl p-2.5 xl:block">
            <p className="mb-2 px-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">Impresión</p>
            <ImpressionMini />
          </div>
        )}
      </div>

      {/* ----- Panel lateral (escritorio) ----- */}
      <aside className="glass-dark absolute bottom-4 right-4 top-[76px] z-20 hidden w-[380px] flex-col overflow-hidden rounded-[28px] lg:flex">
        <nav className="grid grid-cols-4 gap-1 p-2" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl py-2.5 text-[12px] transition-all ${tab === t.id ? "bg-white/[0.12] text-white" : "text-white/55 hover:text-white"}`}>
              <t.icon className="size-[18px]" strokeWidth={1.7} />{t.label}
            </button>
          ))}
        </nav>
        <div key={tab} className="animate-pop flex-1 overflow-y-auto px-5 pb-5 pt-2">
          <h2 className="mb-4 text-lg font-semibold">{tab === "color" ? "Color del cuerpo" : tab === "texto" ? "Texto de impresión" : tab === "figura" ? "Figuras de goma" : "Calcomanías"}</h2>
          {panelContent(tab, "grid")}
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-white/60">{count} decoración{count === 1 ? "" : "es"}</span>
            {priceTag(false)}
          </div>
          <button onClick={addToCart} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-medium text-ink transition hover:bg-white/90 active:scale-[0.98]">
            <ShoppingBag className="size-4" /> Agregar al carrito
          </button>
        </div>
      </aside>

      {/* ----- Hoja inferior (móvil) ----- */}
      <section
        className={`glass-dark absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[28px] transition-[max-height] duration-500 ease-[var(--ease-fluid)] lg:hidden ${mobileExpanded ? "max-h-[78dvh]" : "max-h-[calc(248px+env(safe-area-inset-bottom))]"}`}
        aria-label="Herramientas de personalización"
      >
        <button onClick={() => setSheetOpen((o) => !o)} className="flex h-6 shrink-0 items-center justify-center" aria-label={mobileExpanded ? "Contraer panel" : "Expandir panel"}>
          <span className="h-1 w-10 rounded-full bg-white/25" />
        </button>
        <nav className="flex shrink-0 gap-1 px-3" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id}
              onClick={() => { setTab(t.id); if (t.id !== "texto") setSheetOpen(false); }}
              className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[12.5px] transition-all ${tab === t.id ? "bg-white text-ink" : "text-white/65"}`}>
              <t.icon className="size-4" strokeWidth={1.8} /><span className={t.id === "calcomania" ? "max-[370px]:hidden" : ""}>{t.label}</span>
            </button>
          ))}
        </nav>
        <div key={tab} className="animate-pop min-h-0 flex-1 overflow-y-auto px-4 pb-2 pt-3">
          {tab === "color" ? (
            <div className="flex h-[92px] items-center"><div className="w-full"><ColorPicker /></div></div>
          ) : (
            panelContent(tab, sheetOpen && tab !== "texto" ? "grid" : "row")
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 border-t border-white/10 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
          {mobileExpanded && (
            <button onClick={() => { setSheetOpen(false); if (tab === "texto") setTab("figura"); }} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10" aria-label="Contraer">
              {tab === "texto" ? <X className="size-5" /> : <ChevronDown className="size-5" />}
            </button>
          )}
          <button onClick={addToCart} className="flex h-12 flex-1 items-center justify-between rounded-full bg-white px-5 font-medium text-ink active:scale-[0.98]">
            <span className="flex items-center gap-2"><ShoppingBag className="size-4" /> Continuar pedido</span>
            <span className="text-sm">{priceTag(true)}</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function ImpressionMini() {
  const lines = useDesign((s) => s.present.printLines);
  const font = useDesign((s) => s.present.printFont);
  return <PrintPreview lines={lines} font={font} showGuide={false} className="w-full rounded-2xl" />;
}

