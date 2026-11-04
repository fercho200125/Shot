"use client";
/**
 * Estado del configurador con historial (deshacer/rehacer).
 * Las operaciones continuas (arrastrar, girar con deslizador) usan
 * begin/commit para registrar una sola entrada en el historial.
 */
import { create } from "zustand";
import type { DecorationAsset, PlacedDecoration, StampDesign, SurfaceId } from "@/lib/types";
import { surfaces } from "@/lib/stamp-spec";
import { clampToSurface, findFreeSpot } from "@/lib/domain/placement";
import { demoAssets, demoColors } from "@/lib/data/customization";

const HISTORY_LIMIT = 60;

export const emptyDesign = (): StampDesign => ({
  colorId: demoColors[0].id,
  decorations: [],
  printLines: ["Dr. Carlos Pérez", "Médico General", "", ""],
  printFont: "sans",
});

export const assetById = (id: string) => demoAssets.find((a) => a.id === id);

interface DesignState {
  present: StampDesign;
  past: StampDesign[];
  future: StampDesign[];
  selected: string | null;
  surface: SurfaceId;
  /** Instantánea tomada al iniciar una operación continua. */
  pending: StampDesign | null;
  /** Solicitud de cámara: cambia el nonce para reanimar. */
  view: { surface: SurfaceId; nonce: number };
  feedback: { text: string; nonce: number } | null;
  /** Línea de texto editada por última vez (agrupa la escritura en el historial). */
  textLine: number | null;

  setColor: (id: string) => void;
  add: (asset: DecorationAsset) => boolean;
  select: (uid: string | null) => void;
  setSurface: (s: SurfaceId, moveCamera?: boolean) => void;
  begin: () => void;
  commit: () => void;
  move: (uid: string, x: number, y: number) => void;
  rotate: (uid: string, rotation: number, transient?: boolean) => void;
  remove: (uid: string) => void;
  setPrintLine: (i: number, text: string) => void;
  setPrintFont: (f: StampDesign["printFont"]) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

function clampDecoration(d: PlacedDecoration): PlacedDecoration {
  const a = assetById(d.assetId);
  const s = surfaces[d.surface];
  if (!a) return d;
  const p = clampToSurface(d.x, d.y, d.rotation, a.widthCm, a.heightCm, s.width, s.height);
  return { ...d, ...p };
}

export const useDesign = create<DesignState>()((set, get) => {
  /** Aplica un cambio registrándolo en el historial. */
  const commitChange = (next: StampDesign) => {
    const { present, past } = get();
    set({ present: next, past: [...past, present].slice(-HISTORY_LIMIT), future: [], pending: null, textLine: null });
  };
  const flash = (text: string) => set({ feedback: { text, nonce: Date.now() } });

  return {
    present: emptyDesign(),
    past: [],
    future: [],
    selected: null,
    surface: "frente",
    pending: null,
    view: { surface: "frente", nonce: 0 },
    feedback: null,
    textLine: null,

    setColor: (id) => {
      if (get().present.colorId === id) return;
      commitChange({ ...get().present, colorId: id });
    },

    add: (asset) => {
      const { present, surface } = get();
      const s = surfaces[surface];
      if (asset.widthCm > s.width || asset.heightCm > s.height) {
        flash("No cabe en esta superficie");
        return false;
      }
      const taken = present.decorations.filter((d) => d.surface === surface);
      const p = findFreeSpot(taken, asset.widthCm, asset.heightCm, s.width, s.height);
      const d: PlacedDecoration = { uid: uid(), assetId: asset.id, kind: asset.kind, surface, x: p.x, y: p.y, rotation: 0 };
      commitChange({ ...present, decorations: [...present.decorations, d] });
      set({ selected: d.uid, view: { surface, nonce: Date.now() } });
      flash(`${asset.name} agregado`);
      return true;
    },

    select: (selected) => {
      set({ selected });
      const d = get().present.decorations.find((x) => x.uid === selected);
      if (d && d.surface !== get().surface) set({ surface: d.surface });
    },

    setSurface: (surface, moveCamera = true) =>
      set({ surface, ...(moveCamera ? { view: { surface, nonce: Date.now() } } : {}) }),

    begin: () => {
      if (!get().pending) set({ pending: get().present });
    },

    commit: () => {
      const { pending, present, past } = get();
      if (!pending) return;
      if (JSON.stringify(pending) === JSON.stringify(present)) return set({ pending: null });
      set({ past: [...past, pending].slice(-HISTORY_LIMIT), future: [], pending: null });
    },

    move: (id, x, y) => {
      const present = get().present;
      set({
        present: {
          ...present,
          decorations: present.decorations.map((d) => (d.uid === id ? clampDecoration({ ...d, x, y }) : d)),
        },
      });
    },

    rotate: (id, rotation, transient = false) => {
      const present = get().present;
      const norm = ((Math.round(rotation) % 360) + 360) % 360;
      const next = {
        ...present,
        decorations: present.decorations.map((d) => (d.uid === id ? clampDecoration({ ...d, rotation: norm }) : d)),
      };
      if (transient) set({ present: next });
      else commitChange(next);
    },

    remove: (id) => {
      const present = get().present;
      commitChange({ ...present, decorations: present.decorations.filter((d) => d.uid !== id) });
      set({ selected: null });
      flash("Elemento eliminado");
    },

    setPrintLine: (i, text) => {
      const { present, textLine, past } = get();
      const lines = [...present.printLines];
      lines[i] = text.slice(0, 32);
      const next = { ...present, printLines: lines };
      // Escritura continua en la misma línea = una sola entrada de historial.
      if (textLine === i && past.length) set({ present: next });
      else commitChange(next);
      set({ textLine: i });
    },

    setPrintFont: (printFont) => {
      if (get().present.printFont === printFont) return;
      commitChange({ ...get().present, printFont });
    },

    undo: () => {
      const { past, present, future } = get();
      if (!past.length) return;
      const prev = past[past.length - 1];
      set({ present: prev, past: past.slice(0, -1), future: [present, ...future], pending: null });
      if (!prev.decorations.some((d) => d.uid === get().selected)) set({ selected: null });
      set({ textLine: null });
    },

    redo: () => {
      const { past, present, future } = get();
      if (!future.length) return;
      const next = future[0];
      set({ present: next, past: [...past, present], future: future.slice(1), pending: null });
      if (!next.decorations.some((d) => d.uid === get().selected)) set({ selected: null });
      set({ textLine: null });
    },

    reset: () => {
      commitChange({ ...emptyDesign(), colorId: get().present.colorId });
      set({ selected: null });
    },
  };
});
