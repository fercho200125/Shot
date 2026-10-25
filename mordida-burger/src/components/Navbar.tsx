import { useEffect, useRef, useState, type ComponentType } from 'react';
import { useCart } from '../hooks/CartContext';
import { asset } from '../lib/asset';
import { formatPrice } from '../lib/money';
import { BagIcon, ChatIcon, HeartIcon, HomeIcon, MenuBookIcon } from './Icons';
import './Navbar.css';

export const SECTIONS: { id: string; label: string; icon: ComponentType<{ size?: number }> }[] = [
  { id: 'inicio', label: 'Inicio', icon: HomeIcon },
  { id: 'menu', label: 'Menú', icon: MenuBookIcon },
  { id: 'nosotros', label: 'Nosotros', icon: HeartIcon },
  { id: 'contacto', label: 'Contacto', icon: ChatIcon },
];

interface Props {
  active: string;
  onOpenCart: () => void;
}

/** Anima el contador cuando cambia la cantidad de artículos. */
function useBump(value: number) {
  const [bump, setBump] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [value]);
  return bump;
}

export function Navbar({ active, onOpenCart }: Props) {
  const { totals } = useCart();
  const bump = useBump(totals.count);
  const cartLabel = totals.count
    ? `Abrir pedido: ${totals.count} ${totals.count === 1 ? 'artículo' : 'artículos'}, ${formatPrice(totals.total)}`
    : 'Abrir pedido: vacío';

  return (
    <>
      <header className="topbar">
        <nav className="topbar__inner glass" aria-label="Principal">
          <a className="brand" href="#inicio">
            <img src={asset('img/brand/logo-256.webp')} width="40" height="40" alt="" />
            <span>Mordida Burger</span>
          </a>
          <ul className="topbar__links">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="cart-btn" onClick={onOpenCart} aria-label={cartLabel}>
            <BagIcon />
            <span className="cart-btn__total" aria-hidden="true">
              {totals.count ? formatPrice(totals.total) : 'Pedido'}
            </span>
            <span className={`badge${bump ? ' is-bump' : ''}`} data-empty={totals.count === 0} aria-hidden="true">
              {totals.count}
            </span>
          </button>
        </nav>
      </header>

      <nav className="dock glass" aria-label="Principal">
        <ul>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
                <Icon size={22} />
                <span>{label}</span>
              </a>
            </li>
          ))}
          <li>
            <button type="button" onClick={onOpenCart} aria-label={cartLabel}>
              <span className="dock__bag">
                <BagIcon size={22} />
                <span className={`badge${bump ? ' is-bump' : ''}`} data-empty={totals.count === 0} aria-hidden="true">
                  {totals.count}
                </span>
              </span>
              <span aria-hidden="true">Pedido</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
