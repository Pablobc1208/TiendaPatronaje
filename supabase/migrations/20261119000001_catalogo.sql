-- Migración: 20261119000001_catalogo.sql
-- Catálogo de patrones de costura: categorías, productos, variantes y archivos privados.
-- Incluye extensión unaccent, restricciones, RLS, permisos y función de búsqueda.

-- 1. Extensión unaccent en el esquema extensions para búsquedas insensibles a acentos
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;

-- 2. Tabla de categorías (5 oficiales en un único nivel)
CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  creada_en timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabla de productos (un registro por modelo de patrón)
-- El índice sobre slug se crea implícitamente por la restricción UNIQUE.
CREATE TABLE IF NOT EXISTS productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  descripcion text,
  tela_recomendada text,
  metraje text,
  nivel text CHECK (nivel IN ('Fácil', 'Intermedio', 'Avanzado') OR nivel IS NULL),
  margen_costura boolean,
  activo boolean NOT NULL DEFAULT true,
  creado_en timestamptz NOT NULL DEFAULT now()
);

-- 4. Tabla de variantes de producto (tallas individuales con precio en céntimos)
-- UNIQUE (producto_id, talla) garantiza idempotencia en el seed y evita tallas duplicadas por modelo.
CREATE TABLE IF NOT EXISTS variantes_producto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id uuid NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  talla text NOT NULL,
  precio_centimos integer NOT NULL CHECK (precio_centimos >= 0),
  hojas_a4 integer,
  medidas jsonb,
  creada_en timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_variantes_producto_talla UNIQUE (producto_id, talla)
);

-- 5. Tabla de archivos privados de variantes (PDFs protegidos en bucket privado "patrones")
-- RLS activada SIN políticas públicas: solo accesible por service role en Edge Functions (EPIC4)
CREATE TABLE IF NOT EXISTS archivos_variante (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variante_id uuid NOT NULL UNIQUE REFERENCES variantes_producto(id) ON DELETE CASCADE,
  ruta_pdf text NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now()
);

-- 6. Índices para optimizar consultas habituales
CREATE INDEX IF NOT EXISTS idx_productos_categoria_activo_creado ON productos (categoria_id, activo, creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_variantes_producto_id ON variantes_producto (producto_id);
CREATE INDEX IF NOT EXISTS idx_archivos_variante_variante_id ON archivos_variante (variante_id);

-- 7. Row Level Security (RLS)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE variantes_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos_variante ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura re-ejecutables
DROP POLICY IF EXISTS "Lectura pública de categorías" ON categorias;
CREATE POLICY "Lectura pública de categorías" ON categorias
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Lectura pública de productos activos" ON productos;
CREATE POLICY "Lectura pública de productos activos" ON productos
  FOR SELECT
  TO anon, authenticated
  USING (activo = true);

DROP POLICY IF EXISTS "Lectura pública de variantes activas" ON variantes_producto;
CREATE POLICY "Lectura pública de variantes activas" ON variantes_producto
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM productos p
      WHERE p.id = variantes_producto.producto_id
        AND p.activo = true
    )
  );

-- 8. Función de búsqueda insensible a acentos y mayúsculas
-- SECURITY INVOKER evalúa RLS del usuario que consulta (solo productos activos).
-- SET search_path previene search_path mutable. Se escapan comodines %, _ y \ del término.
CREATE OR REPLACE FUNCTION buscar_patrones(termino text)
RETURNS SETOF productos
LANGUAGE sql STABLE SECURITY INVOKER
SET search_path = public, extensions AS $$
  WITH termino_escapado AS (
    SELECT unaccent('%' || replace(replace(replace(termino, '\', '\\'), '%', '\%'), '_', '\_') || '%') AS patron
  )
  SELECT p.*
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
  CROSS JOIN termino_escapado te
  WHERE (
    unaccent(p.nombre)                            ILIKE te.patron
    OR unaccent(COALESCE(p.descripcion, ''))      ILIKE te.patron
    OR unaccent(COALESCE(p.tela_recomendada, '')) ILIKE te.patron
    OR unaccent(c.nombre)                         ILIKE te.patron
  );
$$;

-- 9. Permisos explícitos para roles anon y authenticated
GRANT SELECT ON categorias, productos, variantes_producto TO anon, authenticated;
REVOKE ALL ON archivos_variante FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION buscar_patrones(text) TO anon, authenticated;
