import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "lila" | "ghost" | "glass" | "light";
const styles: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink/90 shadow-[0_8px_24px_-8px_rgb(23_21_28/0.45)]",
  lila: "bg-lila-deep text-white hover:bg-lila-deep/90 shadow-[0_10px_30px_-10px_rgb(124_95_196/0.7)]",
  ghost: "border border-line bg-white text-ink hover:border-ink/20",
  glass: "glass text-ink hover:bg-white/80",
  light: "bg-white text-ink hover:bg-white/90",
};
const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-[15px] font-medium transition-all duration-300 ease-[var(--ease-fluid)] active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none";

export function Button({ variant = "primary", className = "", ...p }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...p} />;
}

export function ButtonLink({ variant = "primary", className = "", ...p }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${styles[variant]} ${className}`} {...p} />;
}
