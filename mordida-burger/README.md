# Mordida Burger — Menú web interactivo

Menú digital de Mordida Burger con carrito y pedido por WhatsApp.
React + TypeScript + Vite, sin backend ni pagos.

## Ejecutar

```bash
cd mordida-burger
npm install
npm run dev        # desarrollo en http://localhost:5173
npm test           # pruebas del carrito, del pedido y de los datos del menú
npm run build      # typecheck + build de producción en dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

`dist/` es estático y usa rutas relativas (`base: './'`): se puede subir a cualquier hosting o subcarpeta
(Netlify, Vercel, GitHub Pages, Cloudflare Pages…).

## Pedido por WhatsApp

El número oficial (`593984833313`, es decir, wa.me/593984833313) está en [`src/config.ts`](src/config.ts).
Al enviar, la web abre `https://wa.me/593984833313?text=<resumen del pedido>`. No confirma pedidos por su
cuenta: la confirmación llega desde el local por WhatsApp. El cliente también puede **copiar el resumen**.

Para usar otro número sin tocar el código, define `VITE_WHATSAPP_NUMBER` (con código de país, solo dígitos)
en `.env.local` o en las variables de entorno del hosting y vuelve a compilar. Si el número queda vacío
o no es válido, el botón de envío se desactiva.

## Editar el menú

Todo está en [`src/data/menu.ts`](src/data/menu.ts):

- **Precios en centavos** (`650` = $6.50), así no hay errores de redondeo.
- **Ingredientes** como lista: la descripción se arma sola ("a, b, c y d.").
- **`published: false`** oculta un producto sin borrarlo.
- **`extras`**: complementos con precio. Hoy no hay ninguno porque el PDF no define extras.
  Cuando el negocio los confirme, se añaden al producto (`{ id, name, price }`) y la ficha
  los muestra como casillas de selección.

`src/data/menu.test.ts` comprueba que los precios publicados coinciden con el PDF. Si cambian los precios,
actualiza también esa prueba.

### Fotos

Las fotos viven en `public/img/products/` en WebP, en dos tamaños (`nombre.webp` y `nombre-640.webp`):

| Archivo | Dónde se usa |
| --- | --- |
| `portada` | Foto de la portada (tres hamburguesas, la Hawaiana al centro) |
| `bacon-paradise`, `hawaiana`, `spicy` | Tarjeta y ficha de cada producto |
| `nosotros-1` | Franja ancha de la sección Nosotros (Hawaiana y Spicy) |
| `nosotros-2` | Foto junto al texto de Nosotros |

Para añadir o cambiar una:

1. Exporta la foto en WebP (unos 1600 px en el lado mayor) y una copia de 640 px.
2. Ponlas en `public/img/products/`.
3. En `menu.ts`, añade al producto
   `photo: photo('nombre', ancho, alto, 'texto alternativo')`.

Los productos sin `photo` muestran la ilustración de marca indicada en `art`
(`burger`, `fries` o `drink`) sobre fondo violeta.

### Datos del negocio

WhatsApp, dirección, horario y redes sociales se editan en [`src/config.ts`](src/config.ts):

- Dirección: Avenida J15 entre calles 294 y 295, barrio Jocay, Manta.
- Horario: todos los días, de 6:00 p. m. a 12:00 a. m.
- Redes sociales: pendientes. Mientras la lista esté vacía, la web muestra "Por confirmar".

## Pendiente de confirmar con el negocio

| Tema | Estado |
| --- | --- |
| Redes sociales | Se muestran como "Por confirmar". |
| **Spicy Crunch Burger — $10.49** | En el PDF solo existe como **texto oculto** bajo el bloque "CENSORED". Lo que se ve en *Insignias* es Bacon Paradise ($6.50). Está en `menu.ts` con `published: false`. También hay texto oculto "Truffle Royale", sin precio, que no se incluyó. |
| Insignia "CENSORED" | Aparece como tarjeta informativa ("Insignia secreta"), sin precio y sin opción de pedirla. |
| Complementos o extras | El PDF no define ninguno, así que no hay extras a la venta. |
| Fotos | Faltan fotos reales de Meat, bebidas y adicionales. Por ahora se usan ilustraciones de marca. Las fotos actuales miden 1024 px; con originales más grandes la portada se vería más nítida en pantallas grandes. |
| Ortografía | Se corrigió "mozarella" → "mozzarella", "Piña" → "piña", "Coca cola" → "Coca-Cola" y "Fuse tea" → "Fuze Tea" (nombre comercial). |
| Imagen de referencia | `mordida-referencia.png` no venía adjunta. El diseño sigue la dirección descrita en el encargo. |

## Estructura

```
src/
  config.ts              datos del negocio (WhatsApp, dirección, horario, redes)
  data/menu.ts           categorías, productos y precios (fuente única)
  lib/cart.ts            lógica pura del carrito (reducer, totales, validación)
  lib/order.ts           mensaje del pedido y enlace de WhatsApp
  hooks/CartContext.tsx  estado del carrito, guardado en el navegador
  hooks/useModalDialog.ts  <dialog> nativo con animación de cierre
  components/            Navbar, Hero, MenuSection, ProductCard, ProductSheet, CartDrawer…
  styles/tokens.css      colores, tipografías, radios y cristal (Liquid Glass)
public/img/              fotos de producto, logo e ilustraciones
```

## Identidad y diseño

- Colores de marca tomados del PDF: violeta `#4A0073` y crema `#FFFAE6`. Para superficies se usa el
  violeta nocturno `#1B1022`.
- Tipografías originales del menú (incluidas, sin servicios externos): **League Spartan** en títulos y
  **Erica One** en los grandes rótulos ("MENÚ"). En el texto se usa la fuente del sistema
  (SF Pro / Helvetica), como el Helvetica del PDF.
- El logo, los personajes (hamburguesa, papas, fantasma), el fuego de "Spicy", el damero y la retícula
  de papel salen del PDF original. Los personajes vectoriales se extrajeron sin el fondo.
- El efecto cristal se reserva para la navegación, el carrito, la ficha de producto, las pestañas de
  categoría y el aviso de "Agregado".

## Accesibilidad

- Paneles con `<dialog>` nativo: el foco queda dentro, Esc cierra y el foco vuelve al elemento que abrió el panel.
- Pestañas de categoría con roles ARIA y navegación con flechas, Inicio y Fin.
- Foco visible, botones táctiles de 44 px o más y un dock inferior en móvil, al alcance del pulgar.
- Con `prefers-reduced-motion` se desactivan las animaciones.
