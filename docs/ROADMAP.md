# ROADMAP

Leyenda de estados: `new` → `spec` → `plan` → `tasks` → `implement` → `review` → `done`.

| ID    | Nombre                   | Objetivo                                                                                                                                    | Estado    | Terminada |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- |
| EPIC0 | Fundación                | Constitución, specs, arquitectura y roadmap con las respuestas del PM para empezar los sprints SDD.                                         | implement |          |
| EPIC1 | Base técnica             | Proyecto React Router + TypeScript, Supabase conectado, guía visual, tests y despliegue automático en Cloudflare con URL de pruebas.        | new       |          |
| EPIC2 | Catálogo                 | Inicio, categorías, listado con filtros (categoría, talla, precio), búsqueda y ficha de producto con selector de talla.                     | new       |          |
| EPIC3 | Carrito y pago           | Carrito, checkout con email de entrega, pago con Stripe Checkout y pedido guardado.                                                        | new       |          |
| EPIC4 | Entrega y factura        | Correo al email indicado con el PDF comprado y su factura; los PDF nunca son públicos.                                                     | new       |          |
| EPIC5 | Cuenta de cliente        | Registro, login, mis pedidos, volver a descargar mis patrones y mis facturas.                                                              | new       |          |
| EPIC6 | Contenido y legal        | Nosotros, contacto, tabla de medidas, aviso legal, privacidad, cookies (RGPD) y condiciones de venta.                                      | new       |          |
| EPIC7 | Panel de administración  | `/admin` oculto con login seguro: productos, tallas, fotos, PDF, pedidos y facturas.                                                       | new       |          |
| EPIC8 | Migración y lanzamiento  | Importar los productos de WooCommerce, redirecciones 301, SEO, elegir dominio y publicarlo en Cloudflare.                                  | new       |          |

## Backlog

Ideas, hallazgos de revisión aplazados y peticiones que aún no son épicas. Un punto se convierte en épica (estado `new`) cuando el PM decide programarlo.

- Lista de deseos.
- Reseñas de producto.
- Cupones de descuento.
- Newsletter.
- Cursos de patronaje.

## Notas

- `EPIC0` es la épica por defecto de todo proyecto Agile SDD. Viene con el scaffold y empieza en `implement`.
- Cada épica vive en `specs/EPICX/` con su `EPICX.md`, `PLAN.md`, `TASKS.md` y, una vez revisada, `REVIEW.md`.
- Solo hay una épica activa a la vez. Las entradas del roadmap son cortas y accionables.
- Hasta que exista el panel (EPIC7), los productos de prueba se cargan con `supabase/seed.sql` o desde Supabase Studio.
