import type { ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string; priority?: boolean; fill?: boolean };

/** Rutas públicas absolutas → relativas al artefacto. */
export const rel = (src: string) => (src.startsWith("/") ? src.slice(1) : src);

export default function Image({ src, priority, fill: _f, alt = "", ...rest }: Props) {
  return <img src={rel(src)} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" {...rest} />;
}
