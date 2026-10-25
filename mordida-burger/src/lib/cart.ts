import { getProduct, type Extra, type Product } from '../data/menu';

export const MAX_QUANTITY = 99;
export const NOTE_MAX_LENGTH = 140;

export interface CartLine {
  /** Identifica producto + extras + nota: líneas iguales se agrupan. */
  key: string;
  productId: string;
  quantity: number;
  extraIds: string[];
  note: string;
}

export type CartAction =
  | { type: 'add'; productId: string; quantity?: number; extraIds?: string[]; note?: string }
  | { type: 'increment'; key: string }
  | { type: 'decrement'; key: string }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

export function lineKey(productId: string, extraIds: string[], note: string): string {
  return [productId, [...extraIds].sort().join('+'), note.trim().toLowerCase()].join('|');
}

const clamp = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(n)));

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const product = getProduct(action.productId);
      if (!product) return lines;
      const allowed = new Set((product.extras ?? []).map((e) => e.id));
      const extraIds = [...new Set(action.extraIds ?? [])].filter((id) => allowed.has(id)).sort();
      const note = (action.note ?? '').trim().slice(0, NOTE_MAX_LENGTH);
      const quantity = clamp(action.quantity ?? 1);
      const key = lineKey(product.id, extraIds, note);
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        return lines.map((l) => (l.key === key ? { ...l, quantity: clamp(l.quantity + quantity) } : l));
      }
      return [...lines, { key, productId: product.id, quantity, extraIds, note }];
    }
    case 'increment':
      return lines.map((l) => (l.key === action.key ? { ...l, quantity: clamp(l.quantity + 1) } : l));
    case 'decrement':
      return lines.flatMap((l) => {
        if (l.key !== action.key) return [l];
        return l.quantity <= 1 ? [] : [{ ...l, quantity: l.quantity - 1 }];
      });
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
  }
}

export interface ResolvedLine extends CartLine {
  product: Product;
  extras: Extra[];
  /** Precio unitario en centavos (producto + extras). */
  unitPrice: number;
  /** Total de la línea en centavos. */
  total: number;
}

/** Une las líneas con el catálogo vigente. Descarta productos o extras que ya no existan. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.productId);
    if (!product) return [];
    const extras = line.extraIds
      .map((id) => product.extras?.find((e) => e.id === id))
      .filter((e): e is Extra => Boolean(e));
    const unitPrice = product.price + extras.reduce((sum, e) => sum + e.price, 0);
    return [{ ...line, product, extras, unitPrice, total: unitPrice * line.quantity }];
  });
}

export interface CartTotals {
  count: number;
  subtotal: number;
  total: number;
}

export function cartTotals(lines: ResolvedLine[]): CartTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  // Sin recargos ni envíos confirmados: el total coincide con el subtotal.
  return { count, subtotal, total: subtotal };
}

/** Valida datos guardados en el navegador antes de usarlos. */
export function sanitizeStoredLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartLine[]>((acc, raw) => {
    if (!raw || typeof raw !== 'object') return acc;
    const { productId, quantity, extraIds, note } = raw as Record<string, unknown>;
    if (typeof productId !== 'string' || typeof quantity !== 'number' || !Number.isFinite(quantity)) return acc;
    return cartReducer(acc, {
      type: 'add',
      productId,
      quantity,
      extraIds: Array.isArray(extraIds) ? extraIds.filter((x): x is string => typeof x === 'string') : [],
      note: typeof note === 'string' ? note : '',
    });
  }, []);
}
