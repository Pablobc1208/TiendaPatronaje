# Arquitectura

## Propósito

Tienda online de patrones de costura en PDF con panel de administración privado. El cliente compra y recibe el PDF y la factura por correo; Clemen gestiona el catálogo y los pedidos desde `/admin`.

## Stack

| Pieza | Elección | Notas |
| --- | --- | --- |
| Lenguaje | TypeScript (TSX), modo `strict` | |
| Frontend | React 19 + React Router v7 en modo framework | SSR para que las fichas se indexen en Google |
| Estilos | Tailwind CSS | Guía visual única, definida en EPIC1 |
| Hosting | Cloudflare Workers | URL `*.workers.dev` durante el desarrollo; dominio propio a decidir en EPIC8 |
| Base de datos | Supabase Postgres con Row Level Security | Esquema versionado en `supabase/migrations/` |
| Autenticación | Supabase Auth (email + contraseña) | Clientes y administradores; los administradores con rol `admin` y MFA |
| Ficheros | Supabase Storage | Bucket privado `patrones` (PDF) y bucket público `imagenes-productos` |
| Lógica de servidor | Supabase Edge Functions (Deno) | Checkout, webhook de Stripe, factura, correo |
| Pagos | Stripe Checkout + webhooks | No se tocan datos de tarjeta |
| Correo | Resend (a confirmar en EPIC4) | PDF adjunto o enlace firmado si el fichero es grande |
| Facturas | PDF generado por pedido con numeración correlativa | Formato a validar con la gestoría de Clemen |
| Tests | Vitest + Testing Library; Playwright para el flujo de compra | |
| Paquetes | npm, Node 22 LTS | |

## Estructura

Orientativa; se crea en EPIC1.

```
app/                 # React Router: rutas, componentes, lógica de cliente
  routes/            # tienda pública y rutas /admin
  componentes/
  lib/               # cliente Supabase, precios, carrito
supabase/
  migrations/        # SQL versionado y políticas RLS
  functions/         # Edge Functions
  seed.sql
tests/               # unitarios (Vitest) y e2e (Playwright)
wrangler.jsonc       # configuración de Cloudflare
```

Las carpetas que imponen las herramientas (`app/routes`, `supabase/migrations`, `supabase/functions`) conservan su nombre original.

## Patrones y convenciones

- Producto con variantes: un patrón (`productos`) tiene varias tallas (`variantes_producto`), cada una con su precio y su PDF.
- Toda escritura sensible (pedidos, facturas, entrega) ocurre en Edge Functions con la service role; el navegador solo usa la clave pública y RLS.
- Las rutas `/admin` comprueban sesión y rol `admin` en el servidor, llevan `noindex` y están excluidas en `robots.txt`.
- Secretos solo en variables de entorno de Cloudflare y Supabase, nunca en el repo.

## Tests

- Comando de tests: `npm test` (Vitest). Flujo de compra: `npm run test:e2e` (Playwright).
- Organización y convenciones de los tests: tests unitarios junto al código (`*.test.ts(x)`); `tests/e2e/` para Playwright. Los nombres de los tests, en español.

## Prácticas de desarrollo

- Ramas: `feature/EPICX-<nombre>` desde `main`, integradas por PR en `main`.
- Mensajes de commit: `[EPICX][Tn] <resumen>`, en español.
- Idioma del código: todo en español (identificadores, comentarios, textos de la interfaz, tablas y columnas de la base de datos). Se mantienen en inglés solo las palabras reservadas, las APIs de librerías y las convenciones de los frameworks (`loader`, `action`, `useState`…). Ejemplos: `calcularTotalCarrito()`, `productos`, `variantesProducto`.

## Decisiones clave

Entradas cortas y con fecha. Añade una cada vez que una épica introduzca una decisión estructural.

- 2026-10-28: Stripe como pasarela de pago; sin transferencia bancaria.
- 2026-10-28: entrega solo digital, por correo al email que indica el cliente al comprar.
- 2026-10-28: panel de administración en `/admin`, no enlazado, con login seguro.
- 2026-10-28: todo el proyecto en español, código incluido.
- 2026-10-28: React Router v7 con SSR en Cloudflare Workers en lugar de una SPA, por SEO.
