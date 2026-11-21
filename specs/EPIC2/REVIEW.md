# Revisiones de EPIC2

## US1 - Revisión 1 (2026-11-21)

**Veredicto:** APPROVED

### Tests
- `npm test`: 7 suites pasadas, 31 tests pasados (100%).
  - `app/lib/catalogo.servidor.test.ts`: 12 tests unitarios cubriendo exclusión de inactivos, filtrado por categoría y talla, ordenación por novedad y precio, búsqueda unaccent y cálculo de precio «desde».
  - Resto de suites (`configuracion`, `estado`, `precios`, `inicio`, `guia-visual`, `root`): todas pasando.
- `npm run typecheck`: PASS (código 0). Tipos estrictos sin advertencias.
- `npm run lint`: PASS (código 0). Sin incidencias de ESLint.
- `npm run format:check`: PASS (código 0). Formato Prettier verificado en todo el proyecto.

### Criterios de aceptación

| AC | Implementación | Test / Verificación | Estado |
| --- | --- | --- | --- |
| **AC1.1** | `supabase/migrations/20261119000001_catalogo.sql` (tablas `categorias`, `productos`, `variantes_producto`, `archivos_variante`, FKs, índices y políticas RLS públicas de solo lectura) | Aplicada con éxito en Supabase Studio por el PM; RLS y restricciones comprobadas | PASS |
| **AC1.2** | `supabase/migrations/20261119000001_catalogo.sql` (extensión `unaccent` y función `buscar_patrones` con `SECURITY INVOKER`) y `app/lib/catalogo.servidor.ts:obtenerPatrones` | `app/lib/catalogo.servidor.test.ts` › "utiliza la RPC buscar_patrones cuando se indica un término de búsqueda" | PASS |
| **AC1.3** | `supabase/seed.sql` (5 categorías oficiales, 8 patrones reales agrupados y 26 variantes de talla con precios en céntimos y `ON CONFLICT DO NOTHING`) | Ejecutado con éxito en Supabase Studio por el PM (5 categorías, 8 patrones y 26 tallas insertadas) | PASS |
| **AC1.4** | `supabase/migrations/...` (RLS con `activo = true`) y `app/lib/catalogo.servidor.ts` (`obtenerNovedades`, `obtenerPatrones`, `obtenerPatronPorSlug`, `obtenerPatronesRelacionados`, `obtenerTallasDisponibles`) | `app/lib/catalogo.servidor.test.ts` (5 tests específicos comprobando la exclusión estricta de productos inactivos) | PASS |

### Hallazgos (código nuevo o modificado)
- Ninguno bloqueante ni menor.
- Tipos de dominio e identificadores 100% en español (`Categoria`, `VarianteProducto`, `Producto`, `PatronConRelaciones`, `FiltrosCatalogo`, `NivelDificultad`).
- Defensa en profundidad: la exclusión de patrones inactivos está garantizada tanto a nivel de motor de base de datos (política RLS en Postgres) como en las consultas de la capa de acceso a datos del servidor (`catalogo.servidor.ts`).
- Modularidad adecuada: funciones con responsabilidades únicas y tipado desacoplado compatible con `crearClienteSupabaseServidor`.
