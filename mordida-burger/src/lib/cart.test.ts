import { describe, expect, it } from 'vitest';
import { cartReducer, cartTotals, MAX_QUANTITY, resolveLines, sanitizeStoredLines, type CartLine } from './cart';
import { formatPrice } from './money';

const add = (lines: CartLine[], productId: string, quantity = 1, note = '') =>
  cartReducer(lines, { type: 'add', productId, quantity, note });

describe('carrito', () => {
  it('agrega productos y agrupa iguales', () => {
    let lines = add([], 'hawaiana');
    lines = add(lines, 'hawaiana', 2);
    expect(lines).toHaveLength(1);
    expect(lines[0]!.quantity).toBe(3);
  });

  it('separa líneas con notas distintas', () => {
    let lines = add([], 'meat', 1, 'sin cebolla');
    lines = add(lines, 'meat');
    expect(lines).toHaveLength(2);
  });

  it('ignora productos inexistentes o no publicados', () => {
    expect(add([], 'no-existe')).toEqual([]);
    expect(add([], 'spicy-crunch-burger')).toEqual([]);
  });

  it('aumenta, reduce y elimina', () => {
    let lines = add([], 'spicy');
    const key = lines[0]!.key;
    lines = cartReducer(lines, { type: 'increment', key });
    expect(lines[0]!.quantity).toBe(2);
    lines = cartReducer(lines, { type: 'decrement', key });
    expect(lines[0]!.quantity).toBe(1);
    lines = cartReducer(lines, { type: 'decrement', key });
    expect(lines).toEqual([]);
    lines = add(add([], 'spicy'), 'meat');
    lines = cartReducer(lines, { type: 'remove', key: lines[0]!.key });
    expect(lines.map((l) => l.productId)).toEqual(['meat']);
  });

  it('limita la cantidad', () => {
    const lines = add([], 'meat', 500);
    expect(lines[0]!.quantity).toBe(MAX_QUANTITY);
  });

  it('calcula subtotal, total y cantidad sin errores de redondeo', () => {
    let lines = add([], 'hawaiana', 2); // 2 × 6.50
    lines = add(lines, 'coca-cola-500ml', 3); // 3 × 0.75
    lines = add(lines, 'salchi-papa'); // 3.75
    lines = add(lines, 'bacon-paradise'); // 6.50
    const totals = cartTotals(resolveLines(lines));
    expect(totals.count).toBe(7);
    expect(totals.subtotal).toBe(2 * 650 + 3 * 75 + 375 + 650);
    expect(formatPrice(totals.total)).toBe('$25.50');
  });

  it('descarta datos guardados inválidos', () => {
    const restored = sanitizeStoredLines([
      { productId: 'meat', quantity: 2, extraIds: [], note: '' },
      { productId: 'borrado', quantity: 1 },
      { productId: 'spicy', quantity: 'x' },
      null,
    ]);
    expect(restored.map((l) => [l.productId, l.quantity])).toEqual([['meat', 2]]);
    expect(sanitizeStoredLines('basura')).toEqual([]);
  });
});
