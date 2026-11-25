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

---

## US2 - Revisión 1 (2026-11-25)

**Veredicto:** NOT_VERIFIED

### Tests
- Ejecución independiente de `npm test`: `N/A` (el subagente no dispone de terminal para ejecutar comandos).
- Comprobaciones ejecutadas en sesión principal:
  - `npm test`: 7 suites pasadas, 36 tests pasados (100%).
  - `npm run typecheck`: PASS (código 0).
  - `npm run lint`: PASS (código 0).
  - `npm run format:check`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test / Verificación | Estado |
| --- | --- | --- | --- |
| **AC2.1** | `app/routes/inicio.tsx:HeroBiografico` (texto biográfico real de Clemen, diseño tipográfico sin `<img>`) | `app/routes/inicio.test.tsx` › `"muestra el hero con el texto biográfico real de Clemen y sin imágenes de stock (AC 2.1)"` | PASS |
| **AC2.2** | `app/routes/inicio.tsx:SeccionCategorias` (enlaces `/patrones?categoria=${categoria.slug}` para las categorías cargadas en `loader`) | `app/routes/inicio.test.tsx` › `"muestra accesos directos a las 5 categorías que enlazan a /patrones?categoria=<slug> (AC 2.2)"` | PASS |
| **AC2.3** | `app/routes/inicio.tsx:loader` y `SeccionNovedades` usando `TarjetaProducto` ("desde X €", foto o "Foto pendiente") | `app/routes/inicio.test.tsx` › `"muestra la sección de Novedades con los últimos 4 patrones usando TarjetaProducto (AC 2.3)"` y `"el loader consulta las categorías y los 4 patrones de novedades usando catalogo.servidor"` | PASS |
| **AC2.4** | `app/routes/inicio.tsx` (layout responsive móvil primero a 360 px sin scroll horizontal) | Comprobación manual en navegador a 360 px registrada por el PM en `specs/EPIC2/TASKS.md` (2026-11-21) | PASS |

### Hallazgos (código nuevo o modificado)
1. [MAJOR] `app/routes/inicio.tsx:79-109` - `SeccionCategorias` tiene 31 líneas, superando el límite de 20 líneas por función de `skills/review/SKILL.md` - Extraer la tarjeta/enlace de categoría a un subcomponente (`EnlaceCategoria`).
2. [MAJOR] `app/routes/inicio.tsx:114-150` - `SeccionNovedades` tiene 37 líneas, superando el límite de 20 líneas por función de `skills/review/SKILL.md` - Extraer la cabecera de la sección a un subcomponente (`CabeceraNovedades`).
3. [MINOR] `app/routes/inicio.tsx:25` - `loader` es una función pública sin tipo de retorno explícito - Declarar el tipo de retorno explícito en `loader`.
4. [MINOR] `app/routes/inicio.test.tsx:228-233` - Uso de `vi.spyOn` sin limpieza con `vi.restoreAllMocks()` en `afterEach` - Restaurar los mocks tras cada test para evitar fugas de estado.
5. [MINOR] `app/routes/inicio.test.tsx:197-225` - El test de novedades no comprueba explícitamente el prefijo `"desde"` junto al precio - Añadir comprobación de texto `"desde"`.

### Observaciones (código no tocado, no bloqueantes)
- `app/routes/inicio.tsx`: `SeccionCategorias` puede reutilizar `Categoria[]` directamente en lugar del tipo en línea.
- Slugs en categorías ya validados y controlados.

### N/A
- Ejecución de `npm test` por el revisor independiente: `N/A` (entorno sin acceso a terminal).

---

## US3 - Revisión 2 (2026-11-25)

**Veredicto:** APPROVED

### Tests
- `npm test`: 14 suites pasadas, 67 tests pasados (100%).
- `npm run typecheck`: PASS (código 0).
- `npm run lint`: PASS (código 0).
- `npm run format:check`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test / Verificación | Estado |
| --- | --- | --- | --- |
| **AC3.1** | `app/routes.ts`, `app/routes/patrones._index.tsx:loader`, `app/componentes/PestaniasCategorias.tsx`, `app/lib/filtros.ts:construirUrlFiltros`, `app/lib/catalogo.servidor.ts:obtenerPatrones` | `app/routes/patrones._index.test.tsx`, `app/componentes/PestaniasCategorias.test.tsx` (3 tests), `app/lib/catalogo.servidor.test.ts` | PASS |
| **AC3.2** | `app/lib/catalogo.servidor.ts:obtenerTallasDisponibles`, `app/lib/formato.ts:ordenarTallas`, `app/componentes/ChipsFiltro.tsx`, `app/routes/patrones._index.tsx:loader` | `app/lib/catalogo.servidor.test.ts`, `app/componentes/ChipsFiltro.test.tsx` (3 tests), `app/routes/patrones._index.test.tsx` | PASS |
| **AC3.3** | `app/componentes/OrdenSelector.tsx` (`DesplegableOrden`, `alCambiarOrden`), `app/routes/patrones._index.tsx:parsearFiltrosUrl`, `app/lib/catalogo.servidor.ts:obtenerPatrones` | `app/componentes/OrdenSelector.test.tsx` (4 tests incluyendo verificación de `requestSubmit()` con `fireEvent.change`), `app/routes/patrones._index.test.tsx`, `app/lib/catalogo.servidor.test.ts` | PASS |
| **AC3.4** | `app/componentes/EstadoSinResultados.tsx`, `app/componentes/Boton.tsx:EnlaceBoton`, `app/routes/patrones._index.tsx` | `app/componentes/EstadoSinResultados.test.tsx`, `app/routes/patrones._index.test.tsx` | PASS |
| **AC3.5** | `app/routes/patrones._index.tsx` (`grid-cols-2`, `px-4`), `app/componentes/PestaniasCategorias.tsx` (`overflow-x-auto`), `app/componentes/ChipsFiltro.tsx` | Comprobación manual en navegador a 360 px / 375 px confirmada y registrada en `specs/EPIC2/TASKS.md` | PASS |

### Hallazgos (código nuevo o modificado)
- Todos los hallazgos de la Ronda 1 han sido subsanados satisfactoriamente:
  1. `loader` de `patrones._index.tsx` reducido a 15 líneas tras extraer `construirFiltrosConsulta`.
  2. `OrdenSelector` reducido tras extraer `DesplegableOrden` (14 líneas).
  3. `construirUrlFiltros` en `app/lib/filtros.ts` simplificado con `asignarSiPresente` (ambas funciones ≤ 15 líneas).
  4. `clasificarTalla` en `app/lib/formato.ts` simplificado extrayendo `obtenerNumeroCurvy` (14 líneas).
  5. `Boton.tsx` unificado con la función auxiliar compartida `obtenerClasesBoton`.
  6. Añadido test interactivo para `alCambiarOrden` con `fireEvent.change` en `OrdenSelector.test.tsx`.
  7. Variable `query` renombrada a `cadenaConsulta` en `app/lib/filtros.ts`.
  8. Identificadores en inglés renombrados a `coincidenciaNumero` e `indiceLetra` en `app/lib/formato.ts`.
  9. Manejador renombrado a `alCambiarOrden` y selector controlado con `value={orden ?? "novedad"}`.
  10. Retirado `font-serif` redundante en el `<h1>` del catálogo y eliminada la clase `scrollbar-none` en `PestaniasCategorias`.
  11. Nota de `T11` en `specs/EPIC2/TASKS.md` actualizada con la referencia a 360 px.
- Ningún hallazgo crítico, mayor ni menor pendiente.


---

## US2 - Revisión 2 (2026-11-25)

**Veredicto:** APPROVED

### Tests
- `npm test`: 7 suites pasadas, 36 tests pasados (100%).
- `npm run typecheck`: PASS (código 0).
- `npm run lint`: PASS (código 0).
- `npm run format:check`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test / Verificación | Estado |
| --- | --- | --- | --- |
| **AC2.1** | `app/routes/inicio.tsx:HeroBiografico` (texto biográfico real de Clemen, diseño tipográfico sin `<img>`) | `app/routes/inicio.test.tsx` › `"muestra el hero con el texto biográfico real de Clemen y sin imágenes de stock (AC 2.1)"` | PASS |
| **AC2.2** | `app/routes/inicio.tsx:SeccionCategorias` y `EnlaceCategoria` (enlaces `/patrones?categoria=${categoria.slug}` para las categorías cargadas en `loader`) | `app/routes/inicio.test.tsx` › `"muestra accesos directos a las 5 categorías que enlazan a /patrones?categoria=<slug> (AC 2.2)"` | PASS |
| **AC2.3** | `app/routes/inicio.tsx:loader`, `CabeceraNovedades` y `SeccionNovedades` usando `TarjetaProducto` ("desde X €", foto o "Foto pendiente") | `app/routes/inicio.test.tsx` › `"muestra la sección de Novedades con los últimos 4 patrones usando TarjetaProducto (AC 2.3)"` y `"el loader consulta las categorías y los 4 patrones de novedades usando catalogo.servidor"` | PASS |
| **AC2.4** | `app/routes/inicio.tsx` (layout responsive móvil primero a 360 px sin scroll horizontal) | Comprobación manual en navegador a 360 px registrada por el PM en `specs/EPIC2/TASKS.md` (2026-11-21) | PASS |

### Hallazgos (código nuevo o modificado)
- Todos los hallazgos de la Ronda 1 han sido subsanados satisfactoriamente:
  1. `SeccionCategorias` reducida a 17 líneas tras extraer `EnlaceCategoria` (11 líneas).
  2. `SeccionNovedades` reducida a 19 líneas tras extraer `CabeceraNovedades` (16 líneas).
  3. `loader` con firma tipada explícita `Promise<ReturnType<typeof data<DatosInicio>>>`.
  4. `app/routes/inicio.test.tsx` incluye `afterEach(() => { vi.restoreAllMocks(); })`.
  5. `app/routes/inicio.test.tsx` verifica explícitamente el texto `"desde"` en las tarjetas de novedades.
- Ningún hallazgo crítico, mayor ni menor pendiente.

---

## US3 - Revisión 1 (2026-11-25)

**Veredicto:** NOT_VERIFIED

### Tests
- Ejecución independiente de `npm test`, `npm run typecheck`, `npm run lint` y `npm run format:check`: `N/A` (el subagente no dispone de terminal para ejecutar comandos).
- Comprobaciones comunicadas por la sesión principal:
  - `npm test`: 14 suites pasadas, 66 tests pasados (100%).
  - `npm run typecheck`: PASS (código 0).
  - `npm run lint`: PASS (código 0).
  - `npm run format:check`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test / Verificación | Estado |
| --- | --- | --- | --- |
| **AC3.1** | `app/routes.ts`, `app/routes/patrones._index.tsx:loader`, `app/componentes/PestaniasCategorias.tsx`, `app/lib/filtros.ts:construirUrlFiltros`, `app/lib/catalogo.servidor.ts:obtenerPatrones` | `app/routes/patrones._index.test.tsx`, `app/componentes/PestaniasCategorias.test.tsx` (3 tests), `app/lib/catalogo.servidor.test.ts` | PASS |
| **AC3.2** | `app/lib/catalogo.servidor.ts:obtenerTallasDisponibles`, `app/lib/formato.ts:ordenarTallas`, `app/componentes/ChipsFiltro.tsx`, `app/routes/patrones._index.tsx:loader` | `app/lib/catalogo.servidor.test.ts`, `app/componentes/ChipsFiltro.test.tsx` (3 tests), `app/routes/patrones._index.test.tsx` | PASS |
| **AC3.3** | `app/componentes/OrdenSelector.tsx`, `app/routes/patrones._index.tsx:parsearFiltrosUrl`, `app/lib/catalogo.servidor.ts:obtenerPatrones` | `app/componentes/OrdenSelector.test.tsx`, `app/routes/patrones._index.test.tsx`, `app/lib/catalogo.servidor.test.ts` | PARCIAL (añadir test de interacción en `OrdenSelector`) |
| **AC3.4** | `app/componentes/EstadoSinResultados.tsx`, `app/componentes/Boton.tsx:EnlaceBoton`, `app/routes/patrones._index.tsx` | `app/componentes/EstadoSinResultados.test.tsx`, `app/routes/patrones._index.test.tsx` | PASS |
| **AC3.5** | `app/routes/patrones._index.tsx` (`grid-cols-2`, `px-4`), `app/componentes/PestaniasCategorias.tsx` (`overflow-x-auto`), `app/componentes/ChipsFiltro.tsx` | Comprobación manual en navegador a 360 px / 375 px registrada por el PM en `specs/EPIC2/TASKS.md` | PASS |

### Hallazgos (código nuevo o modificado)
1. [MAJOR] `app/routes/patrones._index.tsx` - La función `loader` superaba las 20 líneas - Extraer helper `construirFiltrosConsulta`.
2. [MAJOR] `app/componentes/OrdenSelector.tsx` - `OrdenSelector` superaba las 20 líneas - Extraer subcomponente `DesplegableOrden`.
3. [MAJOR] `app/lib/filtros.ts` - `construirUrlFiltros` superaba las 20 líneas y repetía código - Extraer función auxiliar `asignarSiPresente`.
4. [MAJOR] `app/lib/formato.ts` - `clasificarTalla` superaba las 20 líneas - Extraer helper `obtenerNumeroCurvy`.
5. [MAJOR] `app/componentes/Boton.tsx` - `Boton` y `EnlaceBoton` duplicaban estilos Tailwind - Extraer función compartida `obtenerClasesBoton`.
6. [MAJOR] `app/componentes/OrdenSelector.test.tsx` - Falta test de evento para `alCambiarOrden` llamando a `requestSubmit()` - Añadir test interactivo con `fireEvent.change`.
7. [MINOR] `app/lib/filtros.ts` - Identificador `query` en inglés - Renombrar a `cadenaConsulta`.
8. [MINOR] `app/lib/formato.ts` - Identificadores `matchNum` e `indexLetra` - Renombrar a `coincidenciaNumero` e `indiceLetra`.
9. [MINOR] `app/componentes/OrdenSelector.tsx` - Nombre `manejarCambio` y uso de `defaultValue` - Renombrar a `alCambiarOrden` y usar `value={filtros.orden ?? "novedad"}`.
10. [MINOR] `app/routes/patrones._index.tsx` y `app/componentes/PestaniasCategorias.tsx` - Quitar `font-serif` redundante en `<h1>` y retirar clase `scrollbar-none` inoperante; renombrar `cat` a `categoria`.
11. [MINOR] `specs/EPIC2/TASKS.md` - Reflejar la resolución a 360 px en la anotación de `T11`.

### Observaciones (código no tocado, no bloqueantes)
- `app/lib/catalogo.servidor.ts`: funciones base creadas en US1.
- `app/lib/formato.ts`: exclusión deliberada de "Medida única" y "Talla única" para optimizar el filtrado de catálogo.

### N/A
- Ejecución de `npm test` por el revisor independiente: `N/A` (entorno sin acceso a terminal).

---

## US3 - Revisión 2 (2026-11-25)

**Veredicto:** APPROVED

### Tests
- `npm test`: 14 suites pasadas, 67 tests pasados (100%).
- `npm run typecheck`: PASS (código 0).
- `npm run lint`: PASS (código 0).
- `npm run format:check`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test / Verificación | Estado |
| --- | --- | --- | --- |
| **AC3.1** | `app/routes.ts`, `app/routes/patrones._index.tsx:loader`, `app/componentes/PestaniasCategorias.tsx`, `app/lib/filtros.ts:construirUrlFiltros`, `app/lib/catalogo.servidor.ts:obtenerPatrones` | `app/routes/patrones._index.test.tsx`, `app/componentes/PestaniasCategorias.test.tsx` (3 tests), `app/lib/catalogo.servidor.test.ts` | PASS |
| **AC3.2** | `app/lib/catalogo.servidor.ts:obtenerTallasDisponibles`, `app/lib/formato.ts:ordenarTallas`, `app/componentes/ChipsFiltro.tsx`, `app/routes/patrones._index.tsx:loader` | `app/lib/catalogo.servidor.test.ts`, `app/componentes/ChipsFiltro.test.tsx` (3 tests), `app/routes/patrones._index.test.tsx` | PASS |
| **AC3.3** | `app/componentes/OrdenSelector.tsx` (`DesplegableOrden`, `alCambiarOrden`), `app/routes/patrones._index.tsx:parsearFiltrosUrl`, `app/lib/catalogo.servidor.ts:obtenerPatrones` | `app/componentes/OrdenSelector.test.tsx` (4 tests incluyendo verificación de `requestSubmit()` con `fireEvent.change`), `app/routes/patrones._index.test.tsx`, `app/lib/catalogo.servidor.test.ts` | PASS |
| **AC3.4** | `app/componentes/EstadoSinResultados.tsx`, `app/componentes/Boton.tsx:EnlaceBoton`, `app/routes/patrones._index.tsx` | `app/componentes/EstadoSinResultados.test.tsx`, `app/routes/patrones._index.test.tsx` | PASS |
| **AC3.5** | `app/routes/patrones._index.tsx` (`grid-cols-2`, `px-4`), `app/componentes/PestaniasCategorias.tsx` (`overflow-x-auto`), `app/componentes/ChipsFiltro.tsx` | Comprobación manual en navegador a 360 px / 375 px confirmada y registrada en `specs/EPIC2/TASKS.md` | PASS |

### Hallazgos (código nuevo o modificado)
- Todos los hallazgos de la Ronda 1 han sido subsanados satisfactoriamente:
  1. `loader` de `patrones._index.tsx` reducido a 15 líneas tras extraer `construirFiltrosConsulta`.
  2. `OrdenSelector` reducido tras extraer `DesplegableOrden` (14 líneas).
  3. `construirUrlFiltros` en `app/lib/filtros.ts` simplificado con `asignarSiPresente` (ambas funciones ≤ 15 líneas).
  4. `clasificarTalla` en `app/lib/formato.ts` simplificado extrayendo `obtenerNumeroCurvy` (14 líneas).
  5. `Boton.tsx` unificado con la función auxiliar compartida `obtenerClasesBoton`.
  6. Añadido test interactivo para `alCambiarOrden` con `fireEvent.change` en `OrdenSelector.test.tsx`.
  7. Variable `query` renombrada a `cadenaConsulta` en `app/lib/filtros.ts`.
  8. Identificadores en inglés renombrados a `coincidenciaNumero` e `indiceLetra` en `app/lib/formato.ts`.
  9. Manejador renombrado a `alCambiarOrden` y selector controlado con `value={orden ?? "novedad"}`.
  10. Retirado `font-serif` redundante en el `<h1>` del catálogo y eliminada la clase `scrollbar-none` en `PestaniasCategorias`.
  11. Nota de `T11` en `specs/EPIC2/TASKS.md` actualizada con la referencia a 360 px.
- Ningún hallazgo crítico, mayor ni menor pendiente.




