import { useEffect, useState } from 'react';
import { categories, describe, getProduct, type Product } from '../data/menu';
import { useCart } from '../hooks/CartContext';
import { useModalDialog } from '../hooks/useModalDialog';
import { NOTE_MAX_LENGTH } from '../lib/cart';
import { formatPrice } from '../lib/money';
import { CloseIcon, FireIcon } from './Icons';
import { ProductVisual } from './ProductVisual';
import { QuantityStepper } from './QuantityStepper';
import './Sheet.css';
import './ProductSheet.css';

interface Props {
  productId: string | null;
  onClose: () => void;
  onAdded: (product: Product, quantity: number) => void;
}

export function ProductSheet({ productId, onClose, onAdded }: Props) {
  const open = productId !== null;
  const dialogProps = useModalDialog(open, onClose);
  // Conserva el último producto durante la animación de cierre.
  const [shown, setShown] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const { dispatch } = useCart();

  useEffect(() => {
    if (!productId) return;
    setShown(getProduct(productId));
    setQuantity(1);
    setExtraIds([]);
    setNote('');
  }, [productId]);

  const product = shown;
  const extras = product?.extras ?? [];
  const unit = (product?.price ?? 0) + extras.filter((e) => extraIds.includes(e.id)).reduce((s, e) => s + e.price, 0);

  const add = () => {
    if (!product) return;
    dispatch({ type: 'add', productId: product.id, quantity, extraIds, note });
    onAdded(product, quantity);
    onClose();
  };

  return (
    <dialog className="sheet sheet--product glass glass--dense" aria-labelledby="sheet-title" {...dialogProps}>
      {product && (
        <div className="psheet">
          <button type="button" className="icon-btn sheet__close btn--glass" onClick={onClose} aria-label="Cerrar ficha">
            <CloseIcon />
          </button>
          <div className="psheet__visual">
            <ProductVisual product={product} variant="sheet" />
          </div>
          <div className="psheet__info">
            <p className="eyebrow">{categories.find((c) => c.id === product.category)?.name}</p>
            <h2 id="sheet-title" className="psheet__name">
              {product.name}
            </h2>
            <div className="psheet__meta">
              <span className="psheet__price">{formatPrice(product.price)}</span>
              {product.spicy && (
                <span className="chip chip--spicy">
                  <FireIcon size={14} /> Picante
                </span>
              )}
            </div>
            <p className="psheet__desc">{describe(product)}</p>

            {product.ingredients && (
              <div className="psheet__block">
                <h3 className="psheet__label">Incluye</h3>
                <ul className="ingredients">
                  {product.ingredients.map((i) => (
                    <li key={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</li>
                  ))}
                </ul>
              </div>
            )}

            {extras.length > 0 && (
              <fieldset className="psheet__block extras">
                <legend className="psheet__label">Complementos</legend>
                {extras.map((e) => (
                  <label key={e.id} className="extra">
                    <input
                      type="checkbox"
                      checked={extraIds.includes(e.id)}
                      onChange={(ev) =>
                        setExtraIds((ids) => (ev.target.checked ? [...ids, e.id] : ids.filter((x) => x !== e.id)))
                      }
                    />
                    <span>{e.name}</span>
                    <span className="extra__price">+{formatPrice(e.price)}</span>
                  </label>
                ))}
              </fieldset>
            )}

            <div className="psheet__block">
              <label className="psheet__label" htmlFor="sheet-note">
                Indicaciones para la cocina <span>(opcional)</span>
              </label>
              <textarea
                id="sheet-note"
                className="field"
                rows={2}
                maxLength={NOTE_MAX_LENGTH}
                placeholder="Ej.: sin cebolla"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="psheet__actions">
              <QuantityStepper
                size="lg"
                value={quantity}
                label={product.name}
                onIncrement={() => setQuantity((q) => q + 1)}
                onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
              />
              <button type="button" className="btn psheet__add" onClick={add}>
                Agregar · {formatPrice(unit * quantity)}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
