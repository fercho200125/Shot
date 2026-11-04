"use client";
import { useId } from "react";
import type { StampDesign } from "@/lib/types";
import { stampSpec } from "@/lib/stamp-spec";

export const fontFamilies: Record<StampDesign["printFont"], { label: string; css: string }> = {
  sans: { label: "Moderna", css: "var(--font-inter), system-ui, sans-serif" },
  serif: { label: "Clásica", css: "var(--font-serif), Georgia, serif" },
  script: { label: "Caligráfica", css: "var(--font-script), cursive" },
};

/**
 * Vista previa de la impresión real del sello sobre papel.
 * Unidades del SVG: milímetros. Área de impresión referencial (stampSpec.print).
 */
export function PrintPreview({
  lines,
  font,
  ink = "#24346e",
  className = "",
  showGuide = true,
}: {
  lines: string[];
  font: StampDesign["printFont"];
  ink?: string;
  className?: string;
  showGuide?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const W = stampSpec.print.width * 10;
  const H = stampSpec.print.height * 10;
  const paperW = 80;
  const paperH = 46;
  const text = lines.map((l) => l.trim()).filter(Boolean);
  const n = Math.max(1, text.length);
  const lineGap = (H * 0.86) / n;
  const widthFactor = font === "script" ? 0.42 : font === "serif" ? 0.5 : 0.52;

  const sizes = text.map((t, i) => {
    const byHeight = lineGap * (i === 0 ? 0.82 : 0.68);
    const byWidth = (W * 0.92) / Math.max(1, t.length * widthFactor);
    return Math.min(byHeight, byWidth, i === 0 ? 7.2 : 5.2);
  });
  const total = sizes.reduce((a, b) => a + b * 1.18, 0);
  let cursor = -total / 2;

  return (
    <svg viewBox={`0 0 ${paperW} ${paperH}`} className={className} role="img" aria-label={`Vista previa de impresión: ${text.join(", ") || "sin texto"}`}>
      <defs>
        <filter id={`paper-${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3" />
          <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.58  0 0 0 0 0.55  0 0 0 0.07 0" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <filter id={`ink-${id}`} x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.35" result="rough" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.55" result="speckle" />
          <feComposite in="rough" in2="speckle" operator="in" />
        </filter>
        <linearGradient id={`shade-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#f1eee8" />
        </linearGradient>
      </defs>
      <rect width={paperW} height={paperH} fill={`url(#shade-${id})`} filter={`url(#paper-${id})`} />
      <g transform={`translate(${paperW / 2} ${paperH / 2}) rotate(-1.2)`}>
        {showGuide && (
          <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={0.8} fill="none" stroke="#b9b4ac" strokeWidth={0.18} strokeDasharray="0.9 0.9" />
        )}
        <g filter={`url(#ink-${id})`} fill={ink} opacity={0.95} style={{ fontFamily: fontFamilies[font].css }}>
          {text.length === 0 ? (
            <text textAnchor="middle" dominantBaseline="middle" fontSize={3.2} fill="#a8a39b">Escribe tu texto</text>
          ) : (
            text.map((t, i) => {
              const s = sizes[i];
              cursor += s * 1.18;
              return (
                <text key={i} x={0} y={cursor - s * 0.28} textAnchor="middle" fontSize={s} fontWeight={i === 0 ? 600 : 400} letterSpacing={font === "sans" ? 0.05 : 0}>
                  {t}
                </text>
              );
            })
          )}
        </g>
      </g>
      {showGuide && (
        <text x={paperW - 3} y={paperH - 3} textAnchor="end" fontSize={1.9} fill="#a8a39b" style={{ fontFamily: "system-ui" }}>
          Área referencial {stampSpec.print.width} × {stampSpec.print.height} cm
        </text>
      )}
    </svg>
  );
}
