# EPIC2 - Tareas

## Estado

`closed` (aprobado por Pablo el 2026-11-19)

---

## US1 (autonomía: sí): Esquema de base de datos, búsqueda con unaccent y datos de prueba

- [x] [T0] Escribir la migración `supabase/migrations/20261119000001_catalogo.sql` con extensión `unaccent`, tablas `categorias`, `productos`, `variantes_producto`, `archivos_variante`, restricciones (`CHECK (precio_centimos >= 0)`, niveles, margen de costura), índices por slug y categoría, RLS habilitada con políticas públicas de solo lectura y función `buscar_patrones` con `SECURITY INVOKER`. (AC 1.1, 1.2, 1.4)
- [x] [T1] [PM] Aplicar la migración `supabase/migrations/20261119000001_catalogo.sql` en el Editor SQL de Supabase Studio del proyecto remoto. (AC 1.1, 1.2)
- [x] [T2] Escribir el script de datos iniciales `supabase/seed.sql` con inserción idempotente (`ON CONFLICT DO NOTHING`) de las 5 categorías oficiales y 8 patrones reales con sus variantes de talla, precios en céntimos y corrección de erratas conocidas extraídos de la API de la tienda. (AC 1.3)
- [x] [T3] [PM] Ejecutar el seed `supabase/seed.sql` en el Editor SQL de Supabase Studio del proyecto remoto. (AC 1.3)
- [x] [T4] Crear el módulo de acceso a datos `app/lib/catalogo.servidor.ts` con funciones tipadas para consultar productos activos, categorías y variantes desde Supabase, con tests unitarios en Vitest comprobando exclusión de productos inactivos. (AC 1.4)

---

## US2 (autonomía: sí): Portada con presentación de Clemen, categorías y novedades

- [<] [T5] Actualizar `app/routes/inicio.tsx` para incluir el hero biográfico real de Clemen (diseño puramente tipográfico sin imágenes de stock) y los accesos directos a las 5 categorías que enlazan a `/patrones?categoria=<slug>`, con tests en Vitest. (AC 2.1, 2.2)
- [<] [T6] Añadir loader en `app/routes/inicio.tsx` para cargar los últimos 4 patrones activos y renderizar la sección de Novedades usando `TarjetaProducto` ("desde X €" e imagen o "Foto pendiente"), con tests unitarios del loader y de renderizado en Vitest. (AC 2.3)
- [<] [T7] Comprobación manual en el navegador: modo responsive de las DevTools a 360 px de ancho en la portada `/`, verificando que se lee bien y no hay scroll horizontal, anotando el resultado en la tarea. (AC 2.4) [Comprobado por el PM el 2026-11-21 en DevTools a 360 px: hero, categorías y novedades se leen bien, sin scroll horizontal. El error de hidratación de la consola (cz-shortcut-listen) viene de una extensión del navegador, no de la tienda.]

---

## US3: Listado del catálogo con pestañas de categorías, filtros por talla y ordenación

- [ ] [T8] Configurar la ruta `/patrones` en `app/routes.ts` y crear `app/routes/patrones._index.tsx` con su loader para consultar patrones activos y gestionar el filtrado por categoría (`?categoria=`), con tests en Vitest. (AC 3.1)
- [ ] [T9] Crear los componentes `PestaniasCategorias` ("Todas" y las 5 categorías oficiales) y `ChipsFiltro` para filtrar por tallas dinámicas obtenidas de la base de datos (`?talla=`), con tests en Vitest. (AC 3.1, 3.2)
- [ ] [T10] Implementar el selector de ordenación `OrdenSelector` (`?orden=novedad|precio-asc|precio-desc`) y el estado sin resultados con mensaje claro y botón "Quitar filtros", con tests en Vitest. (AC 3.3, 3.4)
- [ ] [T11] Comprobación manual en el navegador: modo responsive de las DevTools a 360 px de ancho en `/patrones`, verificando que filtros, ordenación y cuadrícula se adaptan sin scroll horizontal, anotando el resultado en la tarea. (AC 3.5)

---

## US4: Búsqueda de patrones insensible a mayúsculas y acentos

- [ ] [T12] Integrar el formulario de búsqueda en `app/routes/patrones._index.tsx` y conectar el loader con la función RPC `buscar_patrones` en Supabase cuando se introduce un término `?q=`, con tests en Vitest. (AC 4.1)
- [ ] [T13] Configurar la cabecera/etiqueta `<meta name="robots" content="noindex">` cuando existe el parámetro `?q=` y permitir combinar la búsqueda con filtros de categoría o talla, con tests en Vitest. (AC 4.2)
- [ ] [T14] Renderizar el mensaje "No encontramos patrones para «término»" con enlace a ver todo el catálogo cuando la búsqueda no produce resultados, con tests en Vitest. (AC 4.3)

---

## US5: Ficha detallada de producto con selector de tallas y datos técnicos

- [ ] [T15] Configurar la ruta dinámica `/patrones/:slug` en `app/routes.ts` y crear `app/routes/patrones.$slug.tsx` con su loader, respondiendo con código 404 en español si el slug no existe o está inactivo (`activo = false`), con tests en Vitest. (AC 5.1, 5.2)
- [ ] [T16] Crear el componente `MigasDePan` (`Inicio > Categoría > Patrón`) y configurar `meta()` con title, description y Open Graph personalizados por patrón, con tests en Vitest. (AC 5.1)
- [ ] [T17] Crear el componente `SelectorTalla` (botones interactivos con precio individual por talla o preselección automática si solo hay una) y el bloque de compra informativo (precio con "IVA incluido", botón deshabilitado "Muy pronto podrás comprar aquí" y aviso de entrega en PDF y factura), con tests en Vitest. (AC 5.3, 5.4)
- [ ] [T18] Implementar la sección de especificaciones técnicas opcionales en la ficha (dificultad, margen de costura destacado Sí/No, hojas A4, tela recomendada, metraje y medidas en JSONB), ocultando los campos no indicados, con tests en Vitest. (AC 5.5)
- [ ] [T19] Implementar la sección de productos relacionados al pie de la ficha mostrando hasta 4 patrones activos de la misma categoría mediante `TarjetaProducto`, con tests en Vitest. (AC 5.6)
- [ ] [T20] Comprobación manual en el navegador: modo responsive de las DevTools a 360 px de ancho en `/patrones/<slug>`, verificando que detalles, selectores y tablas se adaptan sin scroll horizontal, anotando el resultado en la tarea. (AC 5.7)
