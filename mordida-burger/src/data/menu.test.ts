import { describe as suite, expect, it } from 'vitest';
import { categories, describe, getProduct, productsIn, products, publishedProducts } from './menu';

// Precios y textos tal como aparecen en la página 2 del PDF "Copia Menú Mordida".
const PDF_PRICES: Record<string, number> = {
  meat: 500,
  hawaiana: 650,
  spicy: 650,
  'bacon-paradise': 650,
  'cheddar-bacon': 400,
  'salchi-papa': 375,
  'aros-de-cebolla': 400,
  'coca-cola-1l': 150,
  'coca-cola-500ml': 75,
  'fuze-tea-personal': 75,
};

suite('menú', () => {
  it('publica exactamente los productos visibles en el PDF con su precio', () => {
    expect(Object.fromEntries(publishedProducts.map((p) => [p.id, p.price]))).toEqual(PDF_PRICES);
  });

  it('no publica la Spicy Crunch Burger (texto oculto en el PDF)', () => {
    expect(getProduct('spicy-crunch-burger')).toBeUndefined();
    expect(products.find((p) => p.id === 'spicy-crunch-burger')?.published).toBe(false);
  });

  it('reproduce las descripciones del PDF', () => {
    expect(describe(getProduct('meat')!)).toBe(
      'Pan de papa, 150 gramos de carne de res, lechuga, tomate, cebolla, queso mozzarella gratinado, salsa Mordida y papas fritas.',
    );
    expect(describe(getProduct('hawaiana')!)).toBe(
      'Pan de papa, 150 gramos de carne de res, lechuga, piña asada, hawaiian honey, queso mozzarella, salsa Mordida y papas fritas.',
    );
    expect(describe(getProduct('spicy')!)).toBe(
      'Pan de papa, 150 gramos de carne de res, pepinillos, tocino, aros de cebolla, queso cheddar, salsa fuego y papas fritas.',
    );
    expect(describe(getProduct('bacon-paradise')!)).toBe(
      'Pan de papa, 150 gramos de carne de res, pepinillos, tocino, mermelada de tocino, queso cheddar, salsa Mordida y papas fritas.',
    );
    expect(describe(getProduct('aros-de-cebolla')!)).toBe('8 unidades de aros de cebolla y 3 salsas.');
  });

  it('no inventa complementos', () => {
    expect(products.every((p) => !p.extras || p.extras.length === 0)).toBe(true);
  });

  it('cada categoría tiene productos', () => {
    for (const c of categories) expect(productsIn(c.id).length).toBeGreaterThan(0);
  });

  it('ids únicos', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });
});
