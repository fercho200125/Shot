import { describe, expect, it } from 'vitest';
import { cartReducer, cartTotals, resolveLines } from './cart';
import { buildOrderMessage, isValidWhatsappNumber, whatsappUrl } from './order';

describe('pedido por WhatsApp', () => {
  const lines = resolveLines(
    cartReducer(cartReducer([], { type: 'add', productId: 'meat', quantity: 2, note: 'sin cebolla' }), {
      type: 'add',
      productId: 'coca-cola-1l',
    }),
  );
  const totals = cartTotals(lines);

  it('genera un resumen legible con cantidades, notas y total', () => {
    const msg = buildOrderMessage(lines, totals, { name: 'Ana', comments: '' });
    expect(msg).toContain('• 2 × Meat — $10.00');
    expect(msg).toContain('($5.00 c/u)');
    expect(msg).toContain('Nota: sin cebolla');
    expect(msg).toContain('• 1 × Coca-Cola 1 litro — $1.50');
    expect(msg).toContain('Total: $11.50');
    expect(msg).toContain('Nombre: Ana');
    expect(msg).not.toContain('Comentarios');
  });

  it('solo genera enlace con un número válido', () => {
    expect(isValidWhatsappNumber('')).toBe(false);
    expect(whatsappUrl('', 'hola')).toBeNull();
    expect(whatsappUrl('593900000000', 'hola & adiós')).toBe('https://wa.me/593900000000?text=hola%20%26%20adi%C3%B3s');
  });
});
