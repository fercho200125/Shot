import { useEffect, useRef, useState } from 'react';
import { business } from '../config';
import { useCart } from '../hooks/CartContext';
import { useModalDialog } from '../hooks/useModalDialog';
import { asset } from '../lib/asset';
import { formatPrice } from '../lib/money';
import { buildOrderMessage, whatsappUrl } from '../lib/order';
import { ArrowLeftIcon, ChatIcon, CheckIcon, CloseIcon, CopyIcon, TrashIcon } from './Icons';
import { ProductVisual } from './ProductVisual';
import { QuantityStepper } from './QuantityStepper';
import './Sheet.css';
import './CartDrawer.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onBrowse: () => void;
}

type Step = 'cart' | 'review';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

export function CartDrawer({ open, onClose, onBrowse }: Props) {
  const dialogProps = useModalDialog(open, onClose);
  const { lines, totals, dispatch } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (open) {
      setStep('cart');
      setSent(false);
    }
  }, [open]);

  useEffect(() => {
    if (lines.length === 0) setStep('cart');
  }, [lines.length]);

  // Al cambiar de paso, lleva el foco al título para lectores de pantalla.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const message = buildOrderMessage(lines, totals, { name, comments });
  const waUrl = whatsappUrl(business.whatsappNumber, message);
  const empty = lines.length === 0;

  return (
    <dialog className="sheet sheet--cart glass glass--dense" aria-labelledby="cart-title" {...dialogProps}>
      <div className="cart">
        <header className="cart__header">
          {step === 'review' && (
            <button type="button" className="icon-btn" onClick={() => setStep('cart')} aria-label="Volver a editar el pedido">
              <ArrowLeftIcon />
            </button>
          )}
          <h2 id="cart-title" className="cart__title" ref={headingRef} tabIndex={-1}>
            {step === 'cart' ? 'Tu pedido' : 'Revisa tu pedido'}
          </h2>
          {!empty && step === 'cart' && (
            <span className="cart__count">
              {totals.count} {totals.count === 1 ? 'artículo' : 'artículos'}
            </span>
          )}
          <button type="button" className="icon-btn cart__close" onClick={onClose} aria-label="Cerrar pedido">
            <CloseIcon />
          </button>
        </header>

        {empty ? (
          <div className="cart__empty">
            <img src={asset('img/brand/burger-character.webp')} width="560" height="515" alt="" loading="lazy" />
            <p className="cart__empty-title">Tu pedido está vacío</p>
            <p>Elige tus favoritas del menú y aparecerán aquí.</p>
            <button type="button" className="btn" onClick={onBrowse}>
              Explorar menú
            </button>
          </div>
        ) : step === 'cart' ? (
          <>
            <ul className="cart__lines">
              {lines.map((line) => (
                <li key={line.key} className="line">
                  <ProductVisual product={line.product} variant="thumb" />
                  <div className="line__info">
                    <div className="line__top">
                      <p className="line__name">{line.product.name}</p>
                      <p className="line__total">{formatPrice(line.total)}</p>
                    </div>
                    <p className="line__unit">{formatPrice(line.unitPrice)} c/u</p>
                    {line.extras.map((e) => (
                      <p key={e.id} className="line__extra">
                        + {e.name} ({formatPrice(e.price)})
                      </p>
                    ))}
                    {line.note && <p className="line__note">Nota: {line.note}</p>}
                    <div className="line__controls">
                      <QuantityStepper
                        value={line.quantity}
                        label={line.product.name}
                        onIncrement={() => dispatch({ type: 'increment', key: line.key })}
                        onDecrement={() => dispatch({ type: 'decrement', key: line.key })}
                      />
                      <button
                        type="button"
                        className="line__remove"
                        onClick={() => dispatch({ type: 'remove', key: line.key })}
                        aria-label={`Eliminar ${line.product.name} del pedido`}
                      >
                        <TrashIcon size={16} />
                        <span aria-hidden="true">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="cart__footer">
              <Totals subtotal={totals.subtotal} total={totals.total} />
              <button type="button" className="btn btn--block" onClick={() => setStep('review')}>
                Revisar pedido
              </button>
            </footer>
          </>
        ) : (
          <>
            <div className="cart__review">
              <div className="summary">
                <ul className="summary__lines">
                  {lines.map((line) => (
                    <li key={line.key}>
                      <span className="summary__qty">{line.quantity}×</span>
                      <span className="summary__name">
                        {line.product.name}
                        {line.extras.map((e) => (
                          <small key={e.id}>+ {e.name}</small>
                        ))}
                        {line.note && <small>Nota: {line.note}</small>}
                      </span>
                      <span className="summary__price">{formatPrice(line.total)}</span>
                    </li>
                  ))}
                </ul>
                <Totals subtotal={totals.subtotal} total={totals.total} />
              </div>

              <div className="cart__fields">
                <label htmlFor="order-name">
                  Tu nombre <span>(opcional)</span>
                </label>
                <input
                  id="order-name"
                  className="field"
                  autoComplete="name"
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="order-comments">
                  Comentarios <span>(opcional)</span>
                </label>
                <textarea
                  id="order-comments"
                  className="field"
                  rows={2}
                  maxLength={240}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <details className="preview">
                <summary>Ver el mensaje que se enviará</summary>
                <pre>{message}</pre>
              </details>
              <p className="cart__legal">Esta web no procesa pagos. El pago y la confirmación se coordinan con el local.</p>
            </div>

            {/* Solo las acciones quedan fijas abajo, para que el resumen tenga espacio en pantallas bajas */}
            <footer className="cart__footer cart__footer--actions">
              {sent && (
                <div className="notice" role="status">
                  <p>
                    Se abrió WhatsApp con tu pedido. El pedido queda confirmado solo cuando {business.name} te responda
                    por ese medio.
                  </p>
                  <button type="button" className="notice__action" onClick={() => dispatch({ type: 'clear' })}>
                    Ya lo envié · vaciar pedido
                  </button>
                </div>
              )}

              {waUrl ? (
                <a className="btn btn--block" href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setSent(true)}>
                  <ChatIcon size={20} />
                  Enviar pedido por WhatsApp
                </a>
              ) : (
                <>
                  <p className="notice notice--warn" role="note">
                    Falta configurar el número oficial de WhatsApp del negocio. Mientras tanto puedes copiar el resumen.
                  </p>
                  <button type="button" className="btn btn--block" disabled>
                    <ChatIcon size={20} />
                    Enviar pedido por WhatsApp
                  </button>
                </>
              )}
              <button
                type="button"
                className="btn btn--glass btn--block"
                onClick={async () => setCopied(await copyText(message))}
              >
                {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
                {copied ? 'Resumen copiado' : 'Copiar resumen'}
              </button>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}

function Totals({ subtotal, total }: { subtotal: number; total: number }) {
  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div className="totals__total">
        <dt>Total</dt>
        <dd>{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
