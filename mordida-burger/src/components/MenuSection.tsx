import { useRef, useState } from 'react';
import { categories, menuTabs, productsIn, teasersIn, type Product, type TabId } from '../data/menu';
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
  const [active, setActive] = useState<TabId>('hamburguesas');
  const barRef = useRef<HTMLDivElement>(null);
  const tab = menuTabs.find((t) => t.id === active)!;
  const grouped = tab.categories.length > 1;
  let index = 0; // orden de aparición, para escalonar la animación de las tarjetas

  const change = (id: TabId) => {
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
          <p className="menu__tagline">{tab.tagline}</p>
          <div key={active}>
            {tab.categories.map((id) => {
              const category = categories.find((c) => c.id === id)!;
              return (
                <section key={id} className="menu__group" aria-labelledby={grouped ? `group-${id}` : undefined}>
                  {grouped && (
                    <header className="menu__group-head">
                      <h3 id={`group-${id}`} className="menu__group-title">
                        {category.name}
                      </h3>
                      <p className="menu__group-tagline">{category.tagline}</p>
                    </header>
                  )}
                  <div className="menu__grid">
                    {productsIn(id).map((p) => (
                      <ProductCard key={p.id} product={p} index={index++} onOpen={onOpenProduct} onAdded={onAdded} />
                    ))}
                    {teasersIn(id).map((t) => (
                      <TeaserCard key={t.id} teaser={t} index={index++} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
