import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  cartReducer,
  cartTotals,
  resolveLines,
  sanitizeStoredLines,
  type CartAction,
  type CartTotals,
  type ResolvedLine,
} from '../lib/cart';

const STORAGE_KEY = 'mordida:cart:v1';

function loadLines() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeStoredLines(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

interface CartContextValue {
  lines: ResolvedLine[];
  totals: CartTotals;
  dispatch: (action: CartAction) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadLines);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(lines.map(({ productId, quantity, extraIds, note }) => ({ productId, quantity, extraIds, note }))),
      );
    } catch {
      // Almacenamiento no disponible (modo privado): el carrito sigue funcionando en memoria.
    }
  }, [lines]);

  const value = useMemo(() => {
    const resolved = resolveLines(lines);
    return { lines: resolved, totals: cartTotals(resolved), dispatch };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
