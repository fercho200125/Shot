# Medistamp · Tienda online + Configurador 3D de sellos

Tienda de **Medistamp (Mery Pinargote, Manta – Ecuador)**: sellos personalizados, figuras de goma,
calcomanías, crochet, porta credenciales retráctiles y accesorios. Su diferenciador es un
**configurador 3D de sellos** pensado primero para móvil.

> Versión de **presentación**. El catálogo de personalización está reducido a propósito:
> **4 colores, 5 figuras de goma y 5 calcomanías**. Los precios, el stock, los pedidos y las
> fotos de producto son **DEMO** y así se indica en la interfaz.

## Cómo ejecutar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm test           # reglas de inventario/pedidos y límites de colocación
npm run typecheck
```

## Rutas

| Ruta | Qué hay |
| --- | --- |
| `/` | Inicio: hero, acceso al configurador, categorías, destacados, personalización, nosotros, FAQ, contacto, footer |
| `/catalogo` | Catálogo con filtros por categoría, búsqueda y disponibilidad |
| `/catalogo/[slug]` | Ficha de producto: galería, variantes, cantidad, agregar al carrito |
| `/configurador` | Configurador 3D (estudio oscuro) |
| `/carrito` | Resumen del pedido y envío por WhatsApp |
| `/admin/*` | Panel: Resumen, Inventario, Pedidos, Personalización, Movimientos, Configuración |

## Configurador 3D

- Sello automático rectangular **geométrico provisional** (Three.js / React Three Fiber): cuerpo de
  plástico, marco, base transparente, almohadilla de tinta y placa de caucho con el texto espejado.
- Medidas de referencia en `src/lib/stamp-spec.ts` (5.3 × 5 × 3.3 cm, **por confirmar**).
- Rotación 360° con dedo o ratón. **Sin zoom ni pinch**: la cámara mantiene una distancia fija
  (solo se recalcula si cambia el tamaño de la pantalla).
- Tres superficies decorables: Frente, Arriba y Atrás.
- Figuras y calcomanías con **tamaño físico fijo**. Se mueven arrastrando, se giran
  (botones ±15° o deslizador) y no salen del área permitida (`src/lib/domain/placement.ts`).
- Eliminar, deshacer y rehacer (también con Ctrl/Cmd+Z, Ctrl+Shift+Z, Supr, flechas y R).
- El texto de impresión es aparte de la decoración. Se ve en la **vista previa sobre papel**
  (`PrintPreview`), que se actualiza al escribir.
- Las figuras y calcomanías son **láminas 2D (SVG)** sobre la superficie. No son modelos 3D.

## Arquitectura

```
src/
  app/                    Rutas (Next.js App Router)
    (store)/              Tienda con header/footer
    configurador/         Experiencia 3D a pantalla completa
    admin/                Panel administrativo
  lib/
    types.ts              Tipos de dominio (equivalen a futuras tablas)
    site.ts               Datos del negocio, WhatsApp, formato de precio
    stamp-spec.ts         Medidas del sello y superficies decorables
    data/                 Datos DEMO (categorías, productos, personalización, inventario, pedidos)
    domain/               Reglas puras: inventario/pedidos, colocación
    order-message.ts      Mensaje de pedido para WhatsApp
  modules/
    store/                Header, Footer
    catalog/              ProductCard, CatalogView, ProductDetail
    configurator/         UI, estado con historial, vista previa en papel, escena 3D
    cart/                 Estado del carrito (persistido) y CartDrawer
    admin/                Repositorio local DEMO y AdminShell
  components/             UI compartida (Logo, Button, Placeholder, Reveal, DemoBadge)
public/
  brand/                  Logotipo (recortado del perfil de Instagram)
  decor/                  Figuras y calcomanías SVG provisionales (ilustraciones originales)
```

### Reglas de pedidos (`src/lib/domain/inventory.ts`, con pruebas)

- Un pedido pendiente no descuenta stock.
- El stock se descuenta solo al confirmar.
- No se puede confirmar sin disponibilidad, ni confirmar dos veces.
- Al cancelar un pedido confirmado, las unidades vuelven al inventario y el historial se conserva.
- Cada ajuste manual guarda la cantidad anterior, la nueva, la diferencia, la fecha y hora y el motivo.

### Persistencia aplazada

No hay base de datos. `modules/admin/admin-store.ts` y `modules/cart/cart-store.ts` guardan
los datos en `localStorage`. Para conectar Supabase u otra base de datos más adelante:

1. Reemplaza las acciones del store por llamadas a la API y conserva la misma interfaz.
2. Ejecuta las funciones de `lib/domain/inventory.ts` en el servidor, dentro de una transacción.
3. Pasa `lib/data/*` a tablas (los tipos de `lib/types.ts` sirven de esquema).

## Recursos reales pendientes

- Fotografías de productos (ahora hay placeholders marcados como «Foto pendiente»).
- Catálogo real: nombres, precios, variantes y disponibilidad.
- Medidas físicas confirmadas del sello y del área de impresión.
- Modelo GLB/GLTF real del sello (se configura en `stampSpec.glbUrl`).
- Figuras y calcomanías reales en SVG o PNG transparente, con su tamaño físico.
- Número de WhatsApp (en `site.ts` o en Admin → Configuración). Si está vacío, WhatsApp pide elegir el contacto.
- Autenticación del panel administrativo (ahora no tiene protección).
- Políticas de envío y tiempos de elaboración.

> Nota: `index.html` en la raíz es una página anterior, de otro proyecto (Shot · videos de pedida). Se conserva sin cambios y Next.js no la usa.
