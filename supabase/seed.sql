-- Datos iniciales (seed) de catálogo para Supabase
-- Contiene las 5 categorías oficiales y 8 patrones reales con sus variantes de talla.
-- Idempotente: ON CONFLICT DO NOTHING en categorías, productos y variantes.
-- IDs obtenidos por subconsulta sobre slug (sin UUIDs fijos).
-- Precios en céntimos (ej. 1250 = 12,50 €). Sin fotos ni PDFs privados en esta fase.

-- ============================================================================
-- 1. Categorías oficiales (5 categorías en un único nivel)
-- ============================================================================

INSERT INTO categorias (nombre, slug) VALUES
  ('Flamenca', 'flamenca'),
  ('Señora', 'senora'),
  ('Caballero', 'caballero'),
  ('Complementos', 'complementos'),
  ('Patrones base', 'patrones-base')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. Productos reales (8 modelos agrupados)
-- ============================================================================

INSERT INTO productos (categoria_id, nombre, slug, descripcion, tela_recomendada, metraje, nivel, margen_costura, activo)
VALUES
  -- 1) Flamenca: Vestido flamenca de nejas
  (
    (SELECT id FROM categorias WHERE slug = 'flamenca'),
    'Vestido flamenca de nejas',
    'vestido-flamenca-nejas',
    'Vestido de nejas ideal para flamenca o vestido de vuelo. Manga transformada para flamenca. No contiene volantes.',
    NULL,
    NULL,
    NULL,
    false,
    true
  ),

  -- 2) Flamenca: Cuerpo y manga de flamenca
  (
    (SELECT id FROM categorias WHERE slug = 'flamenca'),
    'Cuerpo y manga de flamenca',
    'cuerpo-y-manga-de-flamenca',
    'Patrón del cuerpo con costadillos en delantero y espalda con escotes en pico típico de flamenca delante y detrás, con costura en el centro de la espalda para cremallera. Manga de flamenca recta sin volantes, ideal para combinar con falda de nejas y volantes.',
    NULL,
    NULL,
    NULL,
    false,
    true
  ),

  -- 3) Señora: Vestido camisero
  (
    (SELECT id FROM categorias WHERE slug = 'senora'),
    'Vestido camisero',
    'vestido-camisero',
    'Vestido camisero con cuello Mao o tirilla y tapeta delantera para abotonadura hasta la cintura. Con largo por la rodilla, pinza en el pecho, y en la espalda muceta y encuentro central para darle amplitud. Manga corte francesa con puño y botón.',
    NULL,
    'Talla 42: 1,5 m de tejido en ancho de 1,40 m',
    NULL,
    NULL,
    true
  ),

  -- 4) Señora: Falda evasé
  (
    (SELECT id FROM categorias WHERE slug = 'senora'),
    'Falda evasé',
    'falda-evase',
    'Falda sencilla con vuelo natural muy versátil, cómoda y elegante. No lleva pinzas y va acabada con vistas en cintura y cremallera detrás con costura central. Se puede cortar al hilo o al bies.',
    'Tejido con caída y peso (opcional forrar la falda)',
    NULL,
    NULL,
    NULL,
    true
  ),

  -- 5) Señora: Pantalón palazzo
  (
    (SELECT id FROM categorias WHERE slug = 'senora'),
    'Pantalón palazzo',
    'pantalon-palazzo',
    'Pantalón de pata ancha con cremallera delantera, bolsillos y cinturilla con goma elástica en la parte trasera. Cómodo, elegante y versátil.',
    NULL,
    '2 metros de tejido en ancho de 1,40 m',
    NULL,
    false,
    true
  ),

  -- 6) Caballero: Camisa de caballero
  (
    (SELECT id FROM categorias WHERE slug = 'caballero'),
    'Camisa de caballero',
    'camisa-caballero',
    'Camisa de caballero modelo Slim con muceta en hombros y pinzas traseras para entalle en la cintura. Delantero liso abotonado en el centro. Mangas largas con puño y tapetilla, cuello camisero.',
    'Algodón o sarga suave con textura agradable',
    NULL,
    NULL,
    true,
    true
  ),

  -- 7) Complementos: Bolso Macu
  (
    (SELECT id FROM categorias WHERE slug = 'complementos'),
    'Bolso Macu',
    'bolso-macu',
    'Bolso cómodo y práctico para llevar como bandolera, ideal para el día a día o eventos. Amplio para llevar portátil o tablet y utensilios de trabajo o estudio.',
    'Tejido en doble ancho, forro y guata o entretela, cremallera de 60 cm, cinta para asas y vivos al bies',
    '0,50 m de tejido en doble ancho',
    NULL,
    NULL,
    true
  ),

  -- 8) Patrones base: Cuadernillo de patrones base
  (
    (SELECT id FROM categorias WHERE slug = 'patrones-base'),
    'Cuadernillo de patrones base',
    'cuadernillo-patrones-base',
    'Explicación detallada para realizar los patrones base moldeables al cuerpo de señora, caballero y niños. Incluye cuerpo delantero, espalda, mangas, falda y pantalón para transformar en cualquier diseño.',
    NULL,
    NULL,
    NULL,
    NULL,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. Variantes de producto (tallas individuales con precio en céntimos)
-- ============================================================================

-- 1) Variantes: Vestido flamenca de nejas
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'vestido-flamenca-nejas'),
    '42',
    1250,
    NULL,
    '{"largo_desde_cintura": 105}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'vestido-flamenca-nejas'),
    '48 curvy',
    1250,
    38,
    NULL
  )
ON CONFLICT (producto_id, talla) DO NOTHING;

-- 2) Variantes: Cuerpo y manga de flamenca
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'cuerpo-y-manga-de-flamenca'),
    '36',
    1200,
    NULL,
    '{"pecho": 88, "cintura": 68, "cadera": 92, "ancho_espalda": 37}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'cuerpo-y-manga-de-flamenca'),
    '38',
    1200,
    NULL,
    '{"cintura": 72, "cadera": 96, "largo": 92}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'cuerpo-y-manga-de-flamenca'),
    '40',
    1200,
    NULL,
    '{"pecho": 93, "cintura": 76, "cadera": 100}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'cuerpo-y-manga-de-flamenca'),
    '42',
    1200,
    NULL,
    '{"pecho": 100, "cintura": 80, "cadera": 104, "ancho_espalda": 39.5}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'cuerpo-y-manga-de-flamenca'),
    '44',
    1200,
    NULL,
    '{"pecho": 104, "cintura": 82, "cadera": 108, "ancho_espalda": 40}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'cuerpo-y-manga-de-flamenca'),
    '46',
    1200,
    NULL,
    '{"pecho": 108, "cintura": 86, "cadera": 112, "ancho_espalda": 42}'::jsonb
  )
ON CONFLICT (producto_id, talla) DO NOTHING;

-- 3) Variantes: Vestido camisero
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'vestido-camisero'),
    '42',
    850,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'vestido-camisero'),
    '46 curvy',
    850,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'vestido-camisero'),
    '48 curvy',
    850,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'vestido-camisero'),
    '50 curvy',
    850,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'vestido-camisero'),
    '52 curvy',
    850,
    NULL,
    NULL
  )
ON CONFLICT (producto_id, talla) DO NOTHING;

-- 4) Variantes: Falda evasé
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'falda-evase'),
    '38',
    540,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'falda-evase'),
    '40',
    540,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'falda-evase'),
    '42',
    540,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'falda-evase'),
    '44',
    540,
    NULL,
    '{"cintura": 84, "cadera": 109, "largo": 74}'::jsonb
  )
ON CONFLICT (producto_id, talla) DO NOTHING;

-- 5) Variantes: Pantalón palazzo
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'pantalon-palazzo'),
    '46 curvy',
    850,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'pantalon-palazzo'),
    '48 curvy',
    850,
    NULL,
    NULL
  ),
  (
    (SELECT id FROM productos WHERE slug = 'pantalon-palazzo'),
    '50 curvy',
    850,
    NULL,
    NULL
  )
ON CONFLICT (producto_id, talla) DO NOTHING;

-- 6) Variantes: Camisa de caballero
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'camisa-caballero'),
    'S',
    1090,
    NULL,
    '{"pecho": 102, "cintura": 84, "cadera": 100, "ancho_espalda": 46, "largo_manga": 64, "largo": 72}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'camisa-caballero'),
    'M',
    1090,
    NULL,
    '{"pecho": 108, "cintura": 92, "cadera": 104, "ancho_espalda": 52, "largo_manga": 66, "largo": 74}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'camisa-caballero'),
    'L',
    1090,
    NULL,
    '{"pecho": 110, "cintura": 94, "cadera": 112, "ancho_espalda": 52, "largo_manga": 67, "largo": 76}'::jsonb
  ),
  (
    (SELECT id FROM productos WHERE slug = 'camisa-caballero'),
    'XL',
    1090,
    NULL,
    '{"cintura": 114, "cadera": 120, "ancho_espalda": 55, "largo_manga": 70, "largo": 79}'::jsonb
  )
ON CONFLICT (producto_id, talla) DO NOTHING;

-- 7) Variantes: Bolso Macu
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'bolso-macu'),
    'Medida única',
    280,
    NULL,
    NULL
  )
ON CONFLICT (producto_id, talla) DO NOTHING;

-- 8) Variantes: Cuadernillo de patrones base
INSERT INTO variantes_producto (producto_id, talla, precio_centimos, hojas_a4, medidas)
VALUES
  (
    (SELECT id FROM productos WHERE slug = 'cuadernillo-patrones-base'),
    'Talla única',
    690,
    NULL,
    NULL
  )
ON CONFLICT (producto_id, talla) DO NOTHING;
