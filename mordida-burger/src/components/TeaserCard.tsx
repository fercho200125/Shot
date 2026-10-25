import type { CSSProperties } from 'react';
import type { Teaser } from '../data/menu';
import { asset } from '../lib/asset';
import './ProductCard.css';

// Mosaico pixelado del bloque "CENSORED" del menú impreso.
const PIXELS = [
  '#9a9a9a', '#1c1c1c', '#3d3d3d', '#5a5a5a', '#d4d4d4', '#f5f5f5', '#e6e6e6', '#2e2e2e', '#e0e0e0', '#8a8a8a',
  '#f2f2f2', '#a8a8a8', '#616161', '#4a4a4a', '#c8c8c8', '#d9d9d9', '#bdbdbd', '#6b6b6b', '#fafafa', '#1a1a1a',
  '#b5b5b5', '#7a7a7a', '#ededed', '#d0d0d0', '#9e9e9e', '#e8e8e8', '#5c5c5c', '#c2c2c2', '#8f8f8f', '#333333',
  '#6e6e6e', '#f0f0f0', '#a3a3a3', '#e3e3e3', '#575757', '#cfcfcf', '#f7f7f7', '#7d7d7d', '#dcdcdc', '#626262',
];

export function TeaserCard({ teaser, index }: { teaser: Teaser; index: number }) {
  return (
    <article className="card card--teaser" style={{ '--i': index } as CSSProperties} aria-label={teaser.title}>
      <div className="censored" aria-hidden="true">
        <div className="censored__pixels">
          {PIXELS.map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </div>
        <span className="censored__label">• CENSORED •</span>
        <img className="censored__ghost" src={asset('img/brand/ghost-character.webp')} width="548" height="560" alt="" loading="lazy" />
      </div>
      <div className="card__body">
        <div className="card__head">
          <h3 className="card__name">{teaser.title}</h3>
          <span className="card__price card__price--muted">???</span>
        </div>
        <p className="card__desc">{teaser.text}</p>
      </div>
    </article>
  );
}
