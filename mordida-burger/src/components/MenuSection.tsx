import { useRef, useState } from 'react';
import { categories, productsIn, teasersIn, type CategoryId, type Product } from '../data/menu';
import { asset } from '../lib/asset';
import { CategoryTabs, panelId, tabId } from './CategoryTabs';
import { ProductCard } from './ProductCard';
import { TeaserCard } from './TeaserCard';
import './MenuSection.css';

interface Props {
  onOpenProduct: (id: string) => void;
  onAdded: (product: Product, quantity: number) => void;
}

export function MenuSection({ onOpenProduct, onAdded }: Props) {
  const [active, setActive] = useState<CategoryId>('clasicas');
  const barRef = useRef<HTMLDivElement>(null);
  const category = categories.find((c) => c.id === active)!;
  const items = productsIn(active);
  const teasers = teasersIn(active);

  const change = (id: CategoryId) => {
    setActive(id);
    // Si las pestañas están fijadas arriba, vuelve al inicio de la lista.
    const bar = barRef.current;
    if (bar && bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1) {
      document.getElementById('menu-list')?.scrollIntoView({ block: 'start' });
    }
  };

  return (
    <section id="menu" className="menu" aria-labelledby="menu-title">
      <div className="wrap">
        <header className="menu__header">
          <div>
            <p className="eyebrow">Mordida Burger</p>
            <h2 id="menu-title" className="section-title">
              Menú
            </h2>
          </div>
          <img
            className="menu__sticker"
            src={asset('img/brand/fries-character.webp')}
            width="527"
            height="560"
            alt=""
            loading="lazy"
          />
        </header>

        <div id="menu-list" className="menu__bar" ref={barRef}>
          <CategoryTabs active={active} onChange={change} />
        </div>

        <div
          className="menu__panel"
          role="tabpanel"
          id={panelId(active)}
          aria-labelledby={tabId(active)}
          tabIndex={0}
        >
          <p className="menu__tagline">{category.tagline}</p>
          <div className="menu__grid" key={active}>
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={onOpenProduct} onAdded={onAdded} />
            ))}
            {teasers.map((t, i) => (
              <TeaserCard key={t.id} teaser={t} index={items.length + i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
