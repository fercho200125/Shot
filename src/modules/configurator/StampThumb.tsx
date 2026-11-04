import type { StampDesign } from "@/lib/types";
import { demoAssets, demoColors } from "@/lib/data/customization";
import { stampSpec, surfaces } from "@/lib/stamp-spec";

/** Miniatura 2D (vista frontal) de un sello configurado. Para carrito y panel. */
export function StampThumb({ design, className = "" }: { design: StampDesign; className?: string }) {
  const color = demoColors.find((c) => c.id === design.colorId)?.hex ?? "#b9a3e3";
  const W = stampSpec.width;
  const H = stampSpec.height;
  const bodyH = H - stampSpec.baseHeight;
  const s = surfaces.frente;
  const front = design.decorations.filter((d) => d.surface === "frente");
  const others = design.decorations.length - front.length;
  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`-0.4 -0.4 ${W + 0.8} ${H + 0.8}`} className="h-full w-full" aria-label="Vista frontal del sello">
        <rect x={0.05} y={bodyH - 0.05} width={W - 0.1} height={stampSpec.baseHeight} rx={0.25} fill="#dfe7ef" stroke="#c6d0da" strokeWidth={0.04} />
        <rect x={0.4} y={bodyH + 0.55} width={W - 0.8} height={0.28} rx={0.08} fill="#3b3a44" opacity={0.7} />
        <rect x={0} y={0} width={W} height={bodyH} rx={0.45} fill={color} />
        <rect x={0.15} y={0.12} width={W - 0.3} height={0.5} rx={0.25} fill="#fff" opacity={0.25} />
        <g transform={`translate(${W / 2} ${bodyH / 2})`}>
          {front.map((d) => {
            const a = demoAssets.find((a) => a.id === d.assetId);
            if (!a) return null;
            return (
              <image
                key={d.uid}
                href={a.src}
                width={a.widthCm}
                height={a.heightCm}
                x={-a.widthCm / 2}
                y={-a.heightCm / 2}
                transform={`translate(${d.x} ${-d.y}) rotate(${-d.rotation})`}
              />
            );
          })}
        </g>
        <rect x={(W - s.width) / 2} y={(bodyH - s.height) / 2} width={s.width} height={s.height} fill="none" />
      </svg>
      {others > 0 && (
        <span className="absolute bottom-0 right-0 rounded-full bg-ink/80 px-1.5 py-0.5 text-[9px] font-medium text-white">+{others} en otras caras</span>
      )}
    </div>
  );
}
