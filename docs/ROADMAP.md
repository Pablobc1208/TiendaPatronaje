# ROADMAP

Status legend: `new` → `spec` → `plan` → `tasks` → `implement` → `review` → `done`.

| ID    | Name                     | Objective                                                                                                                                   | Status    | Finished |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- |
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

Ideas, deferred review findings and requests that are not epics yet. Promote an item to an epic (status `new`) when the PM decides to schedule it.

- Lista de deseos.
- Reseñas de producto.
- Cupones de descuento.
- Newsletter.
- Cursos de patronaje.

## Notes

- `EPIC0` is the default epic of every Agile SDD project. It ships scaffolded and starts in `implement`.
- Each epic lives in `specs/EPICX/` with its own `EPICX.md`, `PLAN.md`, `TASKS.md` and, once reviewed, `REVIEW.md`.
- Only one epic is active at a time. Keep roadmap entries short and actionable.
- Hasta que exista el panel (EPIC7), los productos de prueba se cargan con `supabase/seed.sql` o desde Supabase Studio.
