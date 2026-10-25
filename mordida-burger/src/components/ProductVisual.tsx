import type { Product } from '../data/menu';
import { asset } from '../lib/asset';
import { DrinkArt } from './DrinkArt';
import './ProductVisual.css';

interface Props {
  product: Product;
  /** `card`: miniatura recortada; `sheet`: foto completa en la ficha; `thumb`: carrito. */
  variant: 'card' | 'sheet' | 'thumb';
  priority?: boolean;
}

const CHARACTER = {
  burger: { src: 'img/brand/burger-character.webp', width: 560, height: 515 },
  fries: { src: 'img/brand/fries-character.webp', width: 527, height: 560 },
} as const;

/** Foto real del producto o, si aún no existe, la ilustración de marca correspondiente. */
export function ProductVisual({ product, variant, priority = false }: Props) {
  const { photo } = product;
  if (photo) {
    const small = photo.srcSmall ? asset(photo.srcSmall) : undefined;
    const large = asset(photo.src);
    return (
      <div className={`visual visual--photo visual--${variant}`}>
        <img
          src={variant === 'thumb' && small ? small : large}
          srcSet={small ? `${small} 640w, ${large} ${photo.width}w` : undefined}
          sizes={variant === 'sheet' ? '(min-width: 760px) 440px, 100vw' : variant === 'thumb' ? '64px' : '(min-width: 1100px) 360px, (min-width: 700px) 45vw, 92vw'}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={photo.focus ? { objectPosition: photo.focus } : undefined}
        />
      </div>
    );
  }

  return (
    <div className={`visual visual--art visual--${variant}`} data-art={product.art}>
      {product.art === 'drink' ? (
        <DrinkArt className="visual__art" />
      ) : (
        <img
          className="visual__art"
          src={asset(CHARACTER[product.art].src)}
          width={CHARACTER[product.art].width}
          height={CHARACTER[product.art].height}
          alt=""
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
