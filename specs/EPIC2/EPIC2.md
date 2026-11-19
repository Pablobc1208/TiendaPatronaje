# EPIC2 - Catálogo

## Problema

Actualmente la tienda solo tiene una portada provisional informativa. Para que los clientes puedan conocer las prendas, encontrar patrones de costura por tipo o talla y consultar sus especificaciones técnicas antes de comprar, hace falta un catálogo interactivo con portada, listado filtrable con buscador y fichas detalladas de producto.

## Objetivo

Implementar la experiencia completa de catálogo de patrones de costura: portada (`/`) con propuesta de valor y novedades, catálogo general (`/patrones`) con búsqueda insensible a acentos (`unaccent`), pestañas por categoría, filtros por talla y ordenación por precio o novedad, y ficha detallada de producto (`/patrones/<slug>`) con selector de tallas y datos técnicos, sobre la base de datos de Supabase.

## No-objetivos

- Proceso de carrito y compra interactiva / checkout con Stripe (corresponde a EPIC3).
- Entrega de archivos PDF o generación de facturas (corresponde a EPIC4).
- Cuentas de cliente o historial de compras (corresponde a EPIC5).
- Gestión del catálogo desde `/admin` (corresponde a EPIC7).
- Migración completa de los 23 patrones de WooCommerce y redirecciones 301 (corresponde a EPIC8).
- Filtros por rango de precios (slider mín/máx), por nivel de dificultad o por margen de costura (aplazados al backlog).
- Pack de compra conjunta de todas las tallas en un solo patrón (aplazado al backlog).

## Historias de usuario

### US1: Esquema de base de datos, búsqueda con unaccent y datos de prueba

Como desarrollador, quiero el esquema de categorías, productos y variantes con la función de búsqueda insensible a acentos y un conjunto de datos iniciales en Supabase, para disponer de datos reales sobre los que construir el catálogo.

Criterios de aceptación:

- **AC1.1** Dado el proyecto de Supabase, cuando se aplica la migración de catálogo, entonces existen las tablas `categorias`, `productos` y `variantes_producto` con claves foráneas, índices por slug y políticas RLS de solo lectura pública.
- **AC1.2** Dada la base de datos, cuando se aplica la migración, entonces se activa la extensión `unaccent` y se crea una función o vista SQL que permite buscar coincidencias insensibles a mayúsculas y acentos en el nombre del patrón, descripción, tela recomendada y nombre de la categoría.
- **AC1.3** Dado el archivo `supabase/seed.sql`, cuando se ejecuta en el Editor SQL de Supabase, entonces se insertan de forma idempotente (`ON CONFLICT DO NOTHING`) las 5 categorías oficiales (*Flamenca*, *Señora*, *Caballero*, *Complementos*, *Patrones base*) y al menos 8 patrones reales con sus variantes de talla y precios en céntimos obtenidos de la tienda actual.
- **AC1.4** Dados los productos en la base de datos, cuando se consultan para portada, listado, búsqueda o ficha, entonces solo se incluyen aquellos con el campo `activo = true`; los patrones inactivos quedan excluidos de todas las vistas públicas.

### US2: Portada con presentación de Clemen, categorías y novedades

Como visitante, quiero una portada en `/` con la historia del taller, accesos directos a las categorías y los patrones más recientes, para conocer la marca y empezar a explorar los patrones disponibles.

Criterios de aceptación:

- **AC2.1** Dada la ruta `/`, cuando el usuario entra, entonces visualiza el hero principal con el texto biográfico real de Clemen ("Clemen Corbacho cose de forma profesional desde los 12 años..."), con diseño puramente tipográfico sobre la paleta aprobada y sin imágenes de stock.
- **AC2.2** Dada la portada, cuando se visualiza la sección de categorías, entonces se muestran accesos directos a las 5 categorías que enlazan a `/patrones?categoria=<slug>`.
- **AC2.3** Dada la portada, cuando carga, entonces muestra una sección de Novedades con los últimos 4 patrones activos utilizando el componente `TarjetaProducto`, indicando *"desde X €"* e imagen o marcador *"Foto pendiente"*.
- **AC2.4** Dada la portada en `/`, cuando se visualiza en una pantalla móvil de 360 px de ancho, entonces se lee bien y no hay scroll horizontal (primero móvil).

### US3: Listado del catálogo con pestañas de categorías, filtros por talla y ordenación

Como cliente, quiero explorar el catálogo en `/patrones` navegando por categorías, filtrando por mi talla y ordenando por novedad o precio, para encontrar fácilmente el patrón que deseo coser.

Criterios de aceptación:

- **AC3.1** Dada la ruta `/patrones`, cuando el usuario entra, entonces se muestra una barra de pestañas con "Todas" y las 5 categorías oficiales, sincronizada con el parámetro `?categoria=<slug>`.
- **AC3.2** Dado el listado del catálogo, cuando se despliegan los filtros, entonces se muestran chips con las tallas reales que existan en la base de datos para los patrones activos, filtrando mediante `?talla=<talla>`.
- **AC3.3** Dado el selector de ordenación, cuando el usuario selecciona una opción, entonces se reordenan los patrones por Novedades (defecto), Precio menor a mayor o Precio mayor a menor, reflejado en `?orden=<opcion>`.
- **AC3.4** Dados unos filtros que no devuelven resultados, cuando se renderiza la página, entonces se muestra un mensaje informativo claro y un botón *"Quitar filtros"* que restablece el listado.
- **AC3.5** Dado el listado del catálogo en `/patrones`, cuando se visualiza en una pantalla móvil de 360 px de ancho, entonces los filtros, la ordenación y la cuadrícula de productos se leen bien y no hay scroll horizontal (primero móvil).

### US4: Búsqueda de patrones insensible a mayúsculas y acentos

Como cliente, quiero buscar patrones introduciendo términos en un buscador dentro de `/patrones`, para localizar prendas por su nombre, descripción o tipo de tela.

Criterios de aceptación:

- **AC4.1** Dado el catálogo `/patrones`, cuando el usuario introduce un término en el buscador (ej. "pantalon", "algodon"), entonces el servidor ejecuta la búsqueda con `unaccent` y muestra los patrones coincidentes en nombre, descripción, tela o categoría.
- **AC4.2** Dada una búsqueda activa, cuando se consulta la URL `?q=<termino>`, entonces se añaden cabeceras/meta de `noindex` para evitar contenido duplicado en motores de búsqueda y se permite combinar con los filtros de categoría o talla.
- **AC4.3** Dada una búsqueda sin coincidencias, cuando termina la consulta, entonces se muestra el texto *"No encontramos patrones para «término»"* junto con un enlace para volver a ver todo el catálogo.

### US5: Ficha detallada de producto con selector de tallas y datos técnicos

Como cliente, quiero consultar la ficha de un patrón en `/patrones/<slug>` con su información técnica, selector de talla y prendas relacionadas, para conocer el detalle de la confección antes de comprar.

Criterios de aceptación:

- **AC5.1** Dada la ruta `/patrones/<slug>`, cuando se visita un patrón existente, entonces se renderiza su ficha con migas de pan (`Inicio > Categoría > Patrón`), meta title y meta description personalizados, y galería de imágenes del bucket público o marcador *"Foto pendiente"*.
- **AC5.2** Dada una petición a `/patrones/<slug>`, cuando el slug no existe o corresponde a un patrón inactivo (`activo = false`), entonces el servidor responde con código 404 y renderiza la página de error en español.
- **AC5.3** Dada la ficha de un patrón con varias tallas, cuando el usuario interactúa, entonces puede seleccionar su talla mediante botones individuales viendo el precio específico de dicha talla; si el patrón tiene una sola talla, no se muestra selector y queda preseleccionada.
- **AC5.4** Dada la ficha, cuando se visualiza el precio, entonces aparece acompañado del texto *"IVA incluido"* y un botón *"Añadir al carrito"* deshabilitado con el texto *"Muy pronto podrás comprar aquí"*, seguido del mensaje *"Recibirás el patrón en PDF en tu correo nada más pagar, junto con la factura"*.
- **AC5.5** Dada la ficha de producto, cuando el patrón contiene datos técnicos, entonces se muestran sus bloques correspondientes (nivel de dificultad Fácil/Intermedio/Avanzado, margen de costura si se conoce —destacado como Sí o No—, número de hojas A4 por variante, tela recomendada, metraje y tabla de medidas por talla o enlace a la tabla general de la tienda); todos los datos técnicos son opcionales y los campos sin indicar no se muestran.
- **AC5.6** Dada la ficha de producto, cuando se llega al final de la página, entonces se muestran hasta 4 patrones relacionados de la misma categoría utilizando `TarjetaProducto`.
- **AC5.7** Dada la ficha de producto en `/patrones/<slug>`, cuando se visualiza en una pantalla móvil de 360 px de ancho, entonces los detalles, selectores y tablas se adaptan correctamente sin scroll horizontal (primero móvil).

## Acuerdo

Resultado de la aclaración (`grill-me`) con el PM (2026-11-19):

- **Decisiones:**
  - Categorías oficiales (un solo nivel, una categoría por patrón): *Flamenca*, *Señora*, *Caballero*, *Complementos*, *Patrones base*.
  - Tallas: siempre individuales, modeladas como variantes con texto libre (ej. "38", "48 curvy", "Talla única (36 a 44)"), cada una con su precio y PDF independiente.
  - En listados y fichas sin talla seleccionada se muestra "desde X €" (precio mínimo de sus variantes).
  - Estado del producto: campo booleano `activo`. Los productos inactivos (`activo = false`) no aparecen en la portada, listado ni búsqueda, y su ficha en `/patrones/<slug>` devuelve 404.
  - Datos técnicos: todos opcionales, incluyendo el margen de costura (puede ser Sí, No o sin indicar). Si se conoce, se destaca; si no está informado, no se muestra. Metraje y telas en texto libre. Nivel de 3 valores (Fácil, Intermedio, Avanzado). Hojas A4 por variante. Tabla de medidas variable en cm o enlace a la general.
  - Catálogo en `/patrones` con filtros por categoría (pestañas) y talla (chips dinámicos de BD). Ordenación por novedad y precio. Sin filtro slider ni filtro de nivel/margen en esta fase.
  - Búsqueda en servidor usando la extensión Postgres `unaccent` sobre nombre, descripción, tela recomendada y categoría. URLs de búsqueda con `noindex`.
  - Portada en `/` con texto biográfico real de Clemen, hero tipográfico sin imágenes de stock y bloque de 4 novedades.
  - Ficha de producto en `/patrones/<slug>` con botón de carrito deshabilitado ("Muy pronto podrás comprar aquí"), aviso de entrega en PDF y factura, precios con IVA incluido y hasta 4 relacionados.
  - Diseño primero móvil: comprobación a 360 px sin scroll horizontal en portada, catálogo y ficha.
  - Datos de desarrollo: `supabase/seed.sql` idempotente (`ON CONFLICT DO NOTHING`) con 8 patrones reales extraídos de la API de la tienda actual, agrupando tallas por modelo y corrigiendo erratas conocidas de origen. Sin fotos ni PDFs en el seed.
- **Riesgos:**
  - La extensión `unaccent` requiere privilegios en Supabase; se integrará en la migración estándar compatible.
  - Tablas de medidas: formato flexible en JSON/columnas para no encorsetar medidas con geometrías dispares.
- **Preguntas abiertas:**
  - Ninguna. Alcance cerrado para entrar en `plan`.

## Ficheros relacionados

- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `specs/CAPABILITIES.md`
- `specs/EPIC2/PLAN.md`
- `specs/EPIC2/TASKS.md`
- `supabase/migrations/`
- `supabase/seed.sql`
- `app/routes/inicio.tsx`
- `app/routes/patrones._index.tsx`
- `app/routes/patrones.$slug.tsx`

## Retro

Se rellena al cerrar la épica.

- Mantener:
- Cambiar:
- Acción:
