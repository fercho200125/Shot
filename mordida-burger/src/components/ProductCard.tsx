import { useEffect, useState, type CSSProperties } from 'react';
import { describe, type Product } from '../data/menu';
import { useCart } from '../hooks/CartContext';
import { formatPrice } from '../lib/money';
import { CheckIcon, FireIcon, PlusIcon } from './Icons';
import { ProductVisual } from './ProductVisual';
import './ProductCard.css';

interface Props {
  product: Product;
  index: number;
  onOpen: (id: string) => void;
  onAdded: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, index, onOpen, onAdded }: Props) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  const quickAdd = () => {
    dispatch({ type: 'add', productId: product.id });
    setAdded(true);
    onAdded(product, 1);
  };

  return (
    <article className="card" style={{ '--i': index } as CSSProperties}>
      <ProductVisual product={product} variant="card" />
      <div className="card__body">
        <div className="card__head">
          <h3 className="card__name">
            <button type="button" className="card__open" onClick={() => onOpen(product.id)}>
              {product.name}
            </button>
          </h3>
          <span className="card__price">{formatPrice(product.price)}</span>
        </div>
        {product.spicy && (
          <span className="chip chip--spicy">
            <FireIcon size={14} /> Picante
          </span>
        )}
        <p className="card__desc">{describe(product)}</p>
        <div className="card__foot">
          <span className="card__more" aria-hidden="true">
            Ver detalles
          </span>
          <button
            type="button"
            className={`add-btn${added ? ' is-added' : ''}`}
            onClick={quickAdd}
            aria-label={`Agregar ${product.name} al pedido`}
          >
            {added ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
            <span aria-hidden="true">{added ? 'Agregado' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
