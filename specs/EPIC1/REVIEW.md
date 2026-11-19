# Revisiones de EPIC1

## US1 - Revisión 1 (2026-11-19)

**Veredicto:** CHANGES_REQUESTED

### Tests
- `npm test`: N/A - El entorno del subagente no disponía de ejecución en terminal.

### Criterios de aceptación

| AC | Implementación | Test | Estado |
| --- | --- | --- | --- |
| AC1.1 | `react-router.config.ts:5`, `app/root.tsx:6-28`, `app/routes/inicio.tsx:11-52` | `app/routes/inicio.test.tsx` › "muestra el nombre de la tienda" | PASS |
| AC1.2 | `package.json:10-12`, `wrangler.jsonc`, `workers/app.ts`, `vite.config.ts` | N/A (configuración de build y Worker) | PASS |
| AC1.3 | `package.json:14-19`, `eslint.config.js`, `.prettierrc.json`, `vitest.config.ts` | N/A (no ejecutable en el entorno del revisor) | N/A |
| AC1.4 | `app/root.tsx:35-60` (`ErrorBoundary`) | Sin test | FAIL |
| AC1.5 | `public/robots.txt:1-3` | N/A (fichero estático) | PASS |

### Hallazgos (código nuevo o modificado)
1. [MAJOR] `app/root.tsx:35` - El componente `ErrorBoundary` implementa la respuesta visual para errores 404 en español (AC1.4), pero no existe ningún test unitario que lo cubra ni verifique los textos. - Corregido en Ronda 2 con `app/root.test.tsx`.
2. [MAJOR] `app/routes/inicio.tsx:11` - La función `Inicio` tenía 42 líneas. - Corregido en Ronda 2 extrayendo subcomponentes.
3. [MAJOR] `app/root.tsx:35` - La función `ErrorBoundary` tenía 26 líneas. - Corregido en Ronda 2 extrayendo `obtenerInformacionError`.
4. [MAJOR] `app/root.tsx:6` - La función `Layout` tenía 23 líneas. - Corregido en Ronda 2 extrayendo `CabeceraDocumento`.
5. [MAJOR] `workers/app.ts:5` - Uso del identificador genérico `manejarPeticion`. - Corregido en Ronda 2 renombrando a `despacharPeticion`.
6. [MINOR] `app/routes/inicio.tsx:35,41` - Clases `min-h-[44px]` sin comentario WCAG. - Corregido en Ronda 2.
7. [MINOR] `app/root.tsx` y `app/routes/inicio.tsx` - Funciones públicas sin tipo de retorno explícito. - Corregido en Ronda 2.

---

## US1 - Revisión 2 (2026-11-19)

**Veredicto:** APPROVED

### Tests
- `npm test`: 6 suites pasadas, 19 tests pasados (100%).
- `npm run typecheck`: PASS (código 0).
- `npm run lint`: PASS (código 0).
- `npm run format:check`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test | Estado |
| --- | --- | --- | --- |
| AC1.1 | `react-router.config.ts`, `app/root.tsx`, `app/routes/inicio.tsx` | `app/routes/inicio.test.tsx` › "muestra el nombre de la tienda" | PASS |
| AC1.2 | `package.json`, `wrangler.jsonc`, `workers/app.ts`, `vite.config.ts` | Configuración Worker Cloudflare | PASS |
| AC1.3 | `package.json`, `eslint.config.js`, `.prettierrc.json`, `vitest.config.ts` | `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test` ejecutados con éxito | PASS |
| AC1.4 | `app/root.tsx` (`ErrorBoundary`, `obtenerInformacionError`) | `app/root.test.tsx` › "muestra el mensaje 404 en español para rutas inexistentes (AC1.4)" | PASS |
| AC1.5 | `public/robots.txt:1-3` | Verificación de exclusión de `/admin` y `/api/` | PASS |

### Hallazgos (código nuevo o modificado)
- Ninguno. Todos los hallazgos de la ronda 1 han sido subsanados satisfactoriamente.

---

## US2 - Revisión 1 (2026-11-19)

**Veredicto:** APPROVED

### Tests
- `npm test`: 6 suites pasadas, 19 tests pasados (100%).
- `app/lib/configuracion.test.ts`: 5 tests unitarios cubriendo validación de variables.
- `app/lib/estado.test.ts`: 4 tests unitarios cubriendo endpoint de salud sin y con red.
- `npm run typecheck`: PASS (código 0).
- `npm run lint`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test | Estado |
| --- | --- | --- | --- |
| AC2.1 | `app/lib/supabase.servidor.ts:crearClienteSupabaseServidor` | Cliente instanciado con `createServerClient`, clave pública y cookies `getAll`/`setAll` | PASS |
| AC2.2 | `app/lib/configuracion.ts:leerConfiguracionSupabase` | `app/lib/configuracion.test.ts` (5 tests de variables ausentes, vacías, inválidas y https) | PASS |
| AC2.3 | `app/routes/api.estado.ts` y `app/lib/estado.ts:comprobarSupabase` | `app/lib/estado.test.ts` (4 tests: ok 200, 401 error, sin red, sin configurar) | PASS |
| AC2.4 | `.gitignore:155-157`, `.dev.vars.example`, `supabase/` | Inspección de repositorio: sin secretos; `.dev.vars` ignorado | PASS |
| AC2.5 | `wrangler.jsonc:vars` y comprobación en local por PM | Verificado por el PM en local con proyecto `TiendaPatronaje` en eu-west-1 | PASS |

### Hallazgos (código nuevo o modificado)
- Ninguno. Funciones < 20 líneas, tipado estricto y sin exposición de secretos.

---

## US3 - Revisión 1 (2026-11-19)

**Veredicto:** APPROVED (con AC3.2 y AC3.3 aplazados al backlog)

### Tests
- `npm run typecheck`: PASS (código 0).
- `npm run lint`: PASS (código 0).
- `npm run format:check`: PASS (código 0).
- `npm test`: PASS (19 tests pasados).

### Criterios de aceptación

| AC | Implementación | Test | Estado |
| --- | --- | --- | --- |
| AC3.1 | `.github/workflows/comprobaciones.yml` | Workflow en `pull_request` y `push` a `main` con typecheck, lint, format:check, test y build | PASS |
| AC3.2 | Despliegue automático a Cloudflare Workers Builds en merge a `main` | Aplazado al backlog de `docs/ROADMAP.md` junto con T10 por decisión del PM | APLAZADO |
| AC3.3 | URL de prueba de Cloudflare por rama de PR | Aplazado al backlog de `docs/ROADMAP.md` junto con T10 por decisión del PM | APLAZADO |

### Hallazgos (código nuevo o modificado)
- Ninguno. El workflow de CI cubre de forma autónoma todas las comprobaciones de calidad requeridas.

---

## US4 - Revisión 1 (2026-11-19)

**Veredicto:** APPROVED

### Tests
- `npm test`: `app/routes/guia-visual.test.tsx` (3 tests cubriendo paleta, tipografías y tarjeta de producto).
- `npm run typecheck`: PASS (código 0).
- `npm run lint`: PASS (código 0).

### Criterios de aceptación

| AC | Implementación | Test | Estado |
| --- | --- | --- | --- |
| AC4.1 | Propuesta visual en `app/routes/guia-visual.tsx` | Aprobada por el PM el 2026-11-19 (paleta cálida de taller de costura: crema, lino, tinta y terracota) | PASS |
| AC4.2 | `app/app.css` (`@theme`), `app/routes/inicio.tsx`, componentes `Boton`, `Etiqueta`, `TarjetaProducto` | Tokens CSS unificados y aplicados en portada provisional y componentes | PASS |
| AC4.3 | `app/routes/inicio.tsx`, `app/componentes/` | Diseño responsive fluido comprobado a 360 px sin desbordamiento ni scroll horizontal | PASS |

### Hallazgos (código nuevo o modificado)
- Ninguno. Componentes modularizados con áreas táctiles accesibles (min 44 px) y tipado estricto.
