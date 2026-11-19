# EPIC2 – Plan

Estado: `closed`

---

## Orden de las historias de usuario

| Orden | US | Justificación |
|---|---|---|
| 1 | **US1** – Esquema de BD, unaccent y seed | Fundamento de todo. Sin tablas ni datos no hay nada que renderizar. Es el único bloque de trabajo sin dependencias de producto. |
| 2 | **US2** – Portada `/` | Dependencia de US1 (necesita los 4 últimos patrones activos). Es la primera página visible para cualquier visita y da valor inmediato. Componentes nuevos mínimos. |
| 3 | **US3** – Catálogo `/patrones` | Dependencia de US1 y comparte layout con US2. Introduce los filtros dinámicos de talla (chips de BD) y la cuadrícula de tarjetas. Es la vista central del catálogo. |
| 4 | **US4** – Búsqueda `?q=` | Dependencia de US1 (función `unaccent`), de US3 (vive dentro de `/patrones` y comparte la cuadrícula de resultados). Se hace justo después para no duplicar lógica de servidor. |
| 5 | **US5** – Ficha `/patrones/<slug>` | Dependencia de US1, US2 y US3 (reutiliza `TarjetaProducto` para los relacionados y la misma consulta de BD). Se hace al final porque requiere la ruta dinámica, el selector de tallas y el 404 personalizado. |

---

## Dependencias

```
US1 ──► US2
US1 ──► US3 ──► US4
US1 ──► US5
US3 ──► US5   (reutiliza TarjetaProducto y la consulta base)
```

No hay dependencias circulares. US1 se puede implementar sin ninguna interfaz visible.

---

## Decisiones técnicas y de entrega

### Modelo de datos

Cuatro tablas en Postgres (Supabase):

```
categorias
  id            uuid          PK  default gen_random_uuid()
  nombre        text          NOT NULL
  slug          text          NOT NULL UNIQUE
  creada_en     timestamptz   NOT NULL default now()

productos
  id            uuid          PK  default gen_random_uuid()
  categoria_id  uuid          FK → categorias.id  NOT NULL
  nombre        text          NOT NULL
  slug          text          NOT NULL UNIQUE     -- un slug único por patrón (las tallas van agrupadas)
  descripcion   text
  tela_recomendada  text
  metraje       text
  nivel         text          CHECK (nivel IN ('Fácil','Intermedio','Avanzado') OR nivel IS NULL)
  margen_costura text         CHECK (margen_costura IN ('Sí','No') OR margen_costura IS NULL)
  activo        boolean       NOT NULL default true
  creado_en     timestamptz   NOT NULL default now()

variantes_producto
  id            uuid          PK  default gen_random_uuid()
  producto_id   uuid          FK → productos.id  NOT NULL
  talla         text          NOT NULL            -- texto libre: "38", "48 curvy", "Talla única (36 a 44)"
  precio_centimos  integer    NOT NULL CHECK (precio_centimos >= 0)
  hojas_a4      integer
  medidas       jsonb                             -- {pecho: 92, cintura: 76, ...} — null si sin indicar

archivos_variante
  id            uuid          PK  default gen_random_uuid()
  variante_id   uuid          FK → variantes_producto.id NOT NULL UNIQUE
  ruta_pdf      text          NOT NULL            -- ruta en el bucket privado "patrones"
  creado_en     timestamptz   NOT NULL default now()
```

Notas:
- **Seguridad de PDF:** `url_pdf` no existe en `variantes_producto`. Los ficheros protegidos se almacenan en la tabla separada `archivos_variante`. Esta tabla tiene RLS activada y **ninguna política pública**; solo podrá ser consultada por la service role desde Supabase Edge Functions en EPIC4. No se rellena ninguna fila en el seed de EPIC2.
- **Un slug por patrón:** Las tallas de un mismo modelo se agrupan bajo un único registro en `productos` con su `slug` único (ej. `vestido-flamenca-nejas`).
- **`medidas` como JSONB en la variante** en lugar de tabla separada por flexibilidad ante geometrías variables.
- **Precio en céntimos:** Número entero con restricción `CHECK (precio_centimos >= 0)`.
- Todos los datos técnicos opcionales se modelan como nulables y no se renderizan en cliente si están a null.

### Índices

```sql
CREATE INDEX ON productos (slug);
CREATE INDEX ON productos (categoria_id, activo, creado_en DESC);
CREATE INDEX ON variantes_producto (producto_id);
CREATE INDEX ON archivos_variante (variante_id);
```

### RLS (Row Level Security)

| Tabla | Política |
|---|---|
| `categorias` | SELECT público sin restricción |
| `productos` | SELECT público con `WHERE activo = true` |
| `variantes_producto` | SELECT público sin restricción (el filtro de visibilidad lo gobierna el producto activo asociado) |
| `archivos_variante` | RLS activada sin políticas públicas (solo accesible vía service role) |

Escrituras restringidas a la service role.

### Búsqueda con unaccent

La extensión `unaccent` se activa en la migración de catálogo con `SECURITY INVOKER` para respetar las políticas de RLS activas en las tablas:

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION buscar_patrones(termino text)
RETURNS SETOF productos
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  SELECT p.*
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
  WHERE (
    unaccent(p.nombre)              ILIKE unaccent('%' || termino || '%')
    OR unaccent(p.descripcion)      ILIKE unaccent('%' || termino || '%')
    OR unaccent(p.tela_recomendada) ILIKE unaccent('%' || termino || '%')
    OR unaccent(c.nombre)           ILIKE unaccent('%' || termino || '%')
  );
$$;
```

Al ejecutarse como `SECURITY INVOKER`, la consulta evalúa la política RLS de `productos` (`WHERE activo = true`), devolviendo automáticamente únicamente patrones activos sin exponer inactivos. El loader de `/patrones` invoca `.rpc('buscar_patrones', { termino: q })`.

### Migraciones y seed

El PM aplica manualmente los scripts SQL en el Editor SQL de Supabase Studio del proyecto remoto en el siguiente orden estricto:

1. **Migración de catálogo:** `supabase/migrations/20261119000001_catalogo.sql`
   - Habilita la extensión `unaccent`.
   - Crea las tablas `categorias`, `productos`, `variantes_producto` y `archivos_variante`.
   - Aplica restricciones, claves foráneas e índices.
   - Habilita RLS en las cuatro tablas y define las políticas de lectura pública para `categorias`, `productos` y `variantes_producto` (dejando `archivos_variante` sin política pública).
   - Crea la función `buscar_patrones` con `SECURITY INVOKER`.
2. **Datos iniciales (Seed):** `supabase/seed.sql`
   - Se ejecuta a continuación en el Editor SQL.
   - Inserta de forma idempotente (`ON CONFLICT DO NOTHING`) las 5 categorías oficiales.
   - Inserta los 8 patrones reales agrupando sus variantes de tallas, precios en céntimos y corrigiendo erratas conocidas.
   - No inserta datos en `archivos_variante`.

### Rutas de React Router

| Ruta | Fichero | Notas |
|---|---|---|
| `/` | `app/routes/inicio.tsx` | Portada con hero tipográfico, categorías y novedades |
| `/patrones` | `app/routes/patrones._index.tsx` | Catálogo filtrable por categoría, talla, orden y buscador |
| `/patrones/:slug` | `app/routes/patrones.$slug.tsx` | Ficha de producto detallada con selector de tallas y 404 para slugs inexistentes o inactivos |

### Metadatos SEO

- Cada ficha exporta `meta()` con `title` y `description` propios del patrón.
- Las URLs `?q=` incluyen `<meta name="robots" content="noindex">` vía el `meta()` del loader.
- La portada y el catálogo tienen títulos genéricos de la tienda.

### Componentes previstos

| Componente | Ubicación | Descripción |
|---|---|---|
| `TarjetaProducto` | `app/componentes/TarjetaProducto.tsx` | Ya existe (EPIC1); soporta `desde` y `foto` |
| `PestaniasCategorias` | `app/componentes/PestaniasCategorias.tsx` | Pestañas horizontales para categorías con scroll en móvil |
| `ChipsFiltro` | `app/componentes/ChipsFiltro.tsx` | Chips de talla dinámicos |
| `OrdenSelector` | `app/componentes/OrdenSelector.tsx` | Selector de ordenación (novedad, precio asc/desc) |
| `MigasDePan` | `app/componentes/MigasDePan.tsx` | Breadcrumbs accesibles |
| `SelectorTalla` | `app/componentes/SelectorTalla.tsx` | Botones de talla interactivos en ficha |

---

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| `unaccent` no disponible en Supabase | Baja (incluida en extensiones admitidas de Postgres) | Alto (bloquea búsqueda) | Se valida al ejecutar la migración en Supabase Studio |
| Datos de la API de origen con erratas en tallas o descripciones | Media | Medio | Agrupar las variantes por modelo bajo un único slug y corregir manualmente las erratas conocidas al redactar el seed |
| Scroll horizontal en pantallas de 360 px | Media | Medio | Validar en navegador/tests componentes a 360 px con `overflow-x-auto` en pestañas y tablas |

---

## Preguntas abiertas

Ninguna. Alcance y plan cerrados.

---

## Aprobación

| | |
|---|---|
| **Propuesto por** | Agente (2026-11-19) |
| **Aprobado por** | Pablo (PM) (2026-11-19) |
| **Estado** | `closed` |
