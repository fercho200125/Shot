/**
 * Menú de Mordida Burger — fuente única de productos y precios.
 *
 * Fuente: "Copia Menú Mordida.pdf" (página 2, contenido visible).
 * Los precios están en centavos de dólar (USD) para evitar errores de redondeo.
 *
 * Para cambiar una foto: coloca el archivo en `public/img/products/` y
 * actualiza el campo `photo` del producto. Si un producto no tiene `photo`,
 * se muestra la ilustración de marca indicada en `art`.
 */

export type CategoryId = 'clasicas' | 'insignias' | 'bebidas' | 'adicionales';

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
}

export interface Extra {
  id: string;
  name: string;
  /** Precio en centavos. Solo añadir extras con precio confirmado por el negocio. */
  price: number;
}

export interface Photo {
  /** Ruta relativa a `public/`. */
  src: string;
  /** Versión reducida (640 px) para tarjetas. */
  srcSmall?: string;
  width: number;
  height: number;
  alt: string;
  /** Encuadre al recortar la foto en tarjetas (CSS object-position). */
  focus?: string;
}

export type Art = 'burger' | 'fries' | 'drink';

export interface Product {
  id: string;
  category: CategoryId;
  name: string;
  /** Precio en centavos. */
  price: number;
  /** Ingredientes tal como aparecen en el menú. Se unen para formar la descripción. */
  ingredients?: string[];
  /** Descripción libre (para productos sin lista de ingredientes). */
  description?: string;
  photo?: Photo;
  art: Art;
  spicy?: boolean;
  /** Complementos opcionales. Vacío hasta que el negocio confirme extras y precios. */
  extras?: Extra[];
  /** `false` = no se muestra en la web (pendiente de confirmación). */
  published: boolean;
  /** Nota interna para el equipo; no se muestra al cliente. */
  pending?: string;
}

/** Categorías del menú impreso. */
export const categories: Category[] = [
  { id: 'clasicas', name: 'Clásicas', tagline: 'Las de siempre.' },
  { id: 'insignias', name: 'Insignias', tagline: 'Las especialidades de la casa.' },
  { id: 'bebidas', name: 'Bebidas', tagline: 'Para acompañar cada mordida.' },
  { id: 'adicionales', name: 'Adicionales', tagline: 'Para compartir… o no.' },
];

export type TabId = 'hamburguesas' | 'bebidas' | 'adicionales';

/** Pestañas del menú web. Una pestaña con varias categorías las muestra con subtítulo. */
export interface MenuTab {
  id: TabId;
  name: string;
  tagline: string;
  categories: CategoryId[];
}

export const menuTabs: MenuTab[] = [
  {
    id: 'hamburguesas',
    name: 'Hamburguesas',
    tagline: 'Todas con pan de papa, 150 g de carne de res y papas fritas.',
    categories: ['clasicas', 'insignias'],
  },
  { id: 'bebidas', name: 'Bebidas', tagline: 'Para acompañar cada mordida.', categories: ['bebidas'] },
  { id: 'adicionales', name: 'Adicionales', tagline: 'Para compartir… o no.', categories: ['adicionales'] },
];

const photo = (name: string, width: number, height: number, alt: string, focus?: string): Photo => ({
  src: `img/products/${name}.webp`,
  srcSmall: `img/products/${name}-640.webp`,
  width,
  height,
  alt,
  focus,
});

export const products: Product[] = [
  // ——— Clásicas ———
  {
    id: 'meat',
    category: 'clasicas',
    name: 'Meat',
    price: 500,
    ingredients: [
      'Pan de papa',
      '150 gramos de carne de res',
      'lechuga',
      'tomate',
      'cebolla',
      'queso mozzarella gratinado',
      'salsa Mordida',
      'papas fritas',
    ],
    art: 'burger',
    published: true,
  },
  {
    id: 'hawaiana',
    category: 'clasicas',
    name: 'Hawaiana',
    price: 650,
    ingredients: [
      'Pan de papa',
      '150 gramos de carne de res',
      'lechuga',
      'piña asada',
      'hawaiian honey',
      'queso mozzarella',
      'salsa Mordida',
      'papas fritas',
    ],
    photo: photo('hawaiana', 683, 1024, 'Hamburguesa Hawaiana con lechuga, piña asada y queso mozzarella fundido sobre una tabla de madera', '50% 49%'),
    art: 'burger',
    published: true,
  },
  {
    id: 'spicy',
    category: 'clasicas',
    name: 'Spicy',
    price: 650,
    ingredients: [
      'Pan de papa',
      '150 gramos de carne de res',
      'pepinillos',
      'tocino',
      'aros de cebolla',
      'queso cheddar',
      'salsa fuego',
      'papas fritas',
    ],
    photo: photo('spicy', 683, 1024, 'Hamburguesa Spicy con aros de cebolla, tocino, queso cheddar y salsa sobre una tabla de madera', '50% 52%'),
    art: 'burger',
    spicy: true,
    published: true,
  },

  // ——— Insignias ———
  {
    id: 'bacon-paradise',
    category: 'insignias',
    name: 'Bacon Paradise',
    price: 650,
    ingredients: [
      'Pan de papa',
      '150 gramos de carne de res',
      'pepinillos',
      'tocino',
      'mermelada de tocino',
      'queso cheddar',
      'salsa Mordida',
      'papas fritas',
    ],
    photo: photo('bacon-paradise', 819, 1024, 'Hamburguesa Bacon Paradise con tocino, queso cheddar fundido y salsa Mordida sobre una tabla de madera', '50% 47%'),
    art: 'burger',
    published: true,
  },
  {
    id: 'spicy-crunch-burger',
    category: 'insignias',
    name: 'Spicy Crunch Burger',
    price: 1049,
    ingredients: ['Spicy chicken', 'jalapeños', 'slaw', 'spicy mayo'],
    art: 'burger',
    spicy: true,
    published: false,
    pending:
      'Aparece solo como texto oculto en el PDF (tapado por el bloque "CENSORED"); no forma parte del menú visible. Confirmar nombre, ingredientes y precio antes de publicar.',
  },

  // ——— Bebidas ———
  {
    id: 'coca-cola-1l',
    category: 'bebidas',
    name: 'Coca-Cola 1 litro',
    price: 150,
    description: 'Presentación de 1 litro.',
    art: 'drink',
    published: true,
  },
  {
    id: 'coca-cola-500ml',
    category: 'bebidas',
    name: 'Coca-Cola 500 ml',
    price: 75,
    description: 'Presentación de 500 ml.',
    art: 'drink',
    published: true,
  },
  {
    id: 'fuze-tea-personal',
    category: 'bebidas',
    name: 'Fuze Tea personal',
    price: 75,
    description: 'Presentación personal.',
    art: 'drink',
    published: true,
  },

  // ——— Adicionales ———
  {
    id: 'cheddar-bacon',
    category: 'adicionales',
    name: 'Cheddar Bacon',
    price: 400,
    ingredients: ['350 gramos de papas', 'salsa de queso cheddar', 'tocino crujiente'],
    art: 'fries',
    published: true,
  },
  {
    id: 'salchi-papa',
    category: 'adicionales',
    name: 'Salchi-Papa',
    price: 375,
    ingredients: ['350 gramos de papas', 'salsas', 'salchicha', 'queso manaba'],
    art: 'fries',
    published: true,
  },
  {
    id: 'aros-de-cebolla',
    category: 'adicionales',
    name: 'Aros de cebolla',
    price: 400,
    ingredients: ['8 unidades de aros de cebolla', '3 salsas'],
    art: 'fries',
    published: true,
  },
];

/**
 * Tarjetas informativas que no se pueden pedir (el PDF muestra una insignia "CENSORED").
 */
export interface Teaser {
  id: string;
  category: CategoryId;
  title: string;
  text: string;
}

export const teasers: Teaser[] = [
  {
    id: 'insignia-secreta',
    category: 'insignias',
    title: 'Insignia secreta',
    text: 'Todavía no podemos contarte nada.',
  },
];

/** Une los ingredientes como en el menú impreso: "a, b, c y d". */
export function joinIngredients(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export function describe(product: Product): string {
  if (product.ingredients?.length) return `${joinIngredients(product.ingredients)}.`;
  return product.description ?? '';
}

export const publishedProducts = products.filter((p) => p.published);

const byId = new Map(publishedProducts.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return byId.get(id);
}

export function productsIn(category: CategoryId): Product[] {
  return publishedProducts.filter((p) => p.category === category);
}

export function teasersIn(category: CategoryId): Teaser[] {
  return teasers.filter((t) => t.category === category);
}

export function productsInTab(tab: MenuTab): Product[] {
  return tab.categories.flatMap(productsIn);
}
