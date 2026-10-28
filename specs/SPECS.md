# Project Specs

## What We Are Building

Una tienda online nueva para Clemen Corbacho Patronaje que sustituye a la actual (WordPress + WooCommerce en https://clemencorbachopatronaje.es/). Vende patrones de costura en PDF: el cliente elige el patrón y la talla, paga con Stripe y recibe el PDF en el correo electrónico que indica al comprar, junto con su factura.

La tienda tiene dos caras:

- **Tienda pública**: catálogo por categorías (Señoras, Caballero…), ficha de producto con selector de talla, carrito, pago, cuenta de cliente para volver a descargar sus patrones, y páginas de contenido y legales.
- **Panel de administración**: accesible solo escribiendo `/admin` (no aparece enlazado en la tienda), con usuario y contraseña seguros. Desde ahí Clemen gestiona productos, tallas, fotos, PDF, pedidos y facturas.

## Why

La tienda actual da mala imagen y vende peor de lo que podría:

- Cada talla es un producto distinto (49 productos para unos pocos patrones), lo que hace el catálogo difícil de recorrer.
- Las fichas no aparecen en Google (`noindex`) y no explican tela, metraje, nivel ni medidas.
- Hay enlaces vacíos, textos sin traducir, marcadores sin rellenar en el aviso de cookies y nombres de producto descuidados.
- No dice si los precios llevan IVA ni cómo se entrega el patrón.

## How

- Frontend en React con TypeScript (TSX), renderizado en servidor para SEO, desplegado en Cloudflare.
- Backend en Supabase: base de datos con Row Level Security, autenticación, almacenamiento privado de los PDF y Edge Functions.
- Pagos con Stripe Checkout. Al confirmarse el pago se crea el pedido, se genera la factura y se envía el correo con el PDF.
- Desarrollo con Agile SDD (`docs/METHODOLOGY.md`): una épica por sprint, PM = Pablo.

## Non-Goals

- Venta de productos físicos y envíos (papel de patrón incluido). Solo producto digital.
- Migrar clientes, cuentas o pedidos de la tienda antigua. Solo se migran los productos.
- Varios idiomas: la tienda es solo en español.
- Lista de deseos, comparador, reseñas, cupones, newsletter y cursos: quedan en el backlog.

## Operating Principles

- Los PDF nunca son públicos: solo se entregan a quien ha pagado, por correo o desde su cuenta.
- El panel de administración no se enlaza desde la tienda y exige rol de administrador además del login.
- Precios con IVA incluido y bien indicados en ficha, carrito y factura.
- Primero móvil: la mayoría de clientas compran desde el teléfono.
- Diseño: una única guía visual propuesta por el agente y aprobada por el PM; sin rondas de referencias.
- Los materiales de Clemen (fotos, logo, textos) los aporta el PM cuando una tarea los necesite; si faltan, se usan marcadores y se pide.

## Additional notes

- The project is developed with the Agile SDD methodology. See `docs/METHODOLOGY.md`.
- What the system does **today**, capability by capability, lives in `specs/CAPABILITIES.md`.
