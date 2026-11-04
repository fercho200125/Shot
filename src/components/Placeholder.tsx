import { CategoryIcon } from "./CategoryIcon";
import { getCategory } from "@/lib/data/categories";

/** Placeholder elegante cuando aún no hay fotografía real del producto. */
export function ProductPlaceholder({ categoryId, className = "", label = true }: { categoryId: string; className?: string; label?: boolean }) {
  const cat = getCategory(categoryId);
  const tint = cat?.tint ?? "#d9d4cc";
  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 30% 20%, #fff 0%, ${tint}55 55%, ${tint}99 100%)` }}
    >
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/40 blur-2xl" />
      <CategoryIcon icon={cat?.icon ?? "sparkle"} className="size-12 text-ink/35" />
      {label && (
        <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium tracking-wide text-ink-soft backdrop-blur">
          Foto pendiente
        </span>
      )}
    </div>
  );
}
