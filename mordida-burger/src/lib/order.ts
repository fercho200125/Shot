import { business } from '../config';
import type { CartTotals, ResolvedLine } from './cart';
import { formatPrice } from './money';

export interface OrderDetails {
  name: string;
  comments: string;
}

/** Texto legible del pedido para enviar por WhatsApp o copiar. */
export function buildOrderMessage(lines: ResolvedLine[], totals: CartTotals, details: OrderDetails): string {
  const out: string[] = [`¡Hola, ${business.name}! Quiero hacer este pedido:`, ''];
  for (const line of lines) {
    out.push(`• ${line.quantity} × ${line.product.name} — ${formatPrice(line.total)}`);
    if (line.quantity > 1) out.push(`   (${formatPrice(line.unitPrice)} c/u)`);
    for (const extra of line.extras) out.push(`   + ${extra.name} (${formatPrice(extra.price)})`);
    if (line.note) out.push(`   Nota: ${line.note}`);
  }
  out.push('', `Subtotal: ${formatPrice(totals.subtotal)}`, `Total: ${formatPrice(totals.total)}`);
  const name = details.name.trim();
  const comments = details.comments.trim();
  if (name || comments) out.push('');
  if (name) out.push(`Nombre: ${name}`);
  if (comments) out.push(`Comentarios: ${comments}`);
  out.push('', 'Quedo pendiente de su confirmación.');
  return out.join('\n');
}

/** Número E.164 sin "+": entre 8 y 15 dígitos. */
export function isValidWhatsappNumber(number: string): boolean {
  return /^\d{8,15}$/.test(number);
}

export function whatsappUrl(number: string, message: string): string | null {
  if (!isValidWhatsappNumber(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
