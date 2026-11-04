/**
 * Enrutador por hash para la vista previa estática (artefacto).
 * Las rutas de Next se traducen a nombres simples: "/catalogo/sello-mini" → "#producto-sello-mini".
 */
import { useSyncExternalStore } from "react";

const routes = ["catalogo", "carrito", "configurador", "admin"] as const;
const adminPages = ["inventario", "pedidos", "personalizacion", "movimientos", "configuracion"];

/** Ruta tipo Next → nombre de hash. */
export function toHash(href: string): string {
  const [pathAndQuery, anchor] = href.split("#");
  const [path, query] = pathAndQuery.split("?");
  const params = new URLSearchParams(query ?? "");
  if (path === "" || path === "/") return anchor ?? "";
  const parts = path.replace(/^\/|\/$/g, "").split("/");
  if (parts[0] === "catalogo" && parts[1]) return `producto-${parts[1]}`;
  if (parts[0] === "catalogo" && params.get("categoria")) return `catalogo-${params.get("categoria")}`;
  if (parts[0] === "admin" && parts[1]) return `admin-${parts[1]}`;
  return parts[0];
}

export interface Route {
  name: "home" | (typeof routes)[number] | "producto";
  pathname: string;
  search: URLSearchParams;
  slug?: string;
  adminPage?: string;
  anchor?: string;
}

/** Nombre de hash → ruta. */
export function parseHash(hash: string): Route {
  const h = decodeURIComponent(hash.replace(/^#/, ""));
  const empty = new URLSearchParams();
  if (h.startsWith("producto-")) {
    const slug = h.slice(9);
    return { name: "producto", pathname: `/catalogo/${slug}`, search: empty, slug };
  }
  if (h.startsWith("catalogo-")) {
    return { name: "catalogo", pathname: "/catalogo", search: new URLSearchParams({ categoria: h.slice(9) }) };
  }
  if (h === "catalogo" || h === "carrito" || h === "configurador") return { name: h, pathname: `/${h}`, search: empty };
  if (h === "admin") return { name: "admin", pathname: "/admin", search: empty };
  if (h.startsWith("admin-") && adminPages.includes(h.slice(6))) {
    return { name: "admin", pathname: `/admin/${h.slice(6)}`, search: empty, adminPage: h.slice(6) };
  }
  return { name: "home", pathname: "/", search: empty, anchor: h || undefined };
}

let current = parseHash(typeof location !== "undefined" ? location.hash : "");
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => {
    const prev = current;
    current = parseHash(location.hash);
    listeners.forEach((l) => l());
    requestAnimationFrame(() => {
      if (current.anchor) document.getElementById(current.anchor)?.scrollIntoView({ behavior: "smooth" });
      else if (prev.pathname !== current.pathname || prev.search.toString() !== current.search.toString()) {
        if (prev.name !== current.name || current.name !== "catalogo") window.scrollTo({ top: 0 });
      }
    });
  });
}

export function navigate(href: string) {
  const h = toHash(href);
  if (("#" + h) === location.hash || (h === "" && location.hash === "")) {
    const r = parseHash(h);
    if (r.anchor) document.getElementById(r.anchor)?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  location.hash = h;
}

export function useRoute() {
  return useSyncExternalStore(
    (cb) => (listeners.add(cb), () => listeners.delete(cb)),
    () => current,
    () => current,
  );
}
