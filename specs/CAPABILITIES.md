# Capacidades

La spec viva: lo que el sistema hace **hoy**, una sección por capacidad. Los ficheros de las épicas son la historia de cómo llegamos aquí; este fichero es la foto actual, para que nadie tenga que repasar todas las épicas para saber cómo funciona algo.

Reglas:

- Solo se actualiza al cerrar una épica (ver `Close` en `docs/METHODOLOGY.md`).
- Describe el comportamiento observable, no la implementación. Enlaza a las US y AC que lo definen en vez de copiarlas.
- Cuando una épica cambia una capacidad existente, reescribe su sección y añade la nueva fuente; no añadas contradicciones al final.

## Capacidades actuales

### Servidor SSR y base de la tienda

- Qué hace: La tienda sirve páginas renderizadas en servidor con HTML en español (`lang="es"`), control de robots para proteger rutas privadas (`/admin`, `/api/`) y una página de error 404 personalizada en español para enlaces inexistentes.
- Definida por: `EPIC1/US1` (AC 1.1, AC 1.4, AC 1.5)
- Último cambio: `EPIC1` (2026-11-19)

### Comprobación de salud y conexión con Supabase

- Qué hace: Expone un endpoint `GET /api/estado` que verifica en tiempo real la conectividad con Supabase devolviendo estado 200 y `supabase.estado = "ok"`, o 503 con el motivo del fallo, gestionando credenciales de forma segura sin exponer claves privadas.
- Definida por: `EPIC1/US2` (AC 2.1, AC 2.2, AC 2.3, AC 2.4, AC 2.5)
- Último cambio: `EPIC1` (2026-11-19)

### Verificación continua de calidad

- Qué hace: El repositorio ejecuta automáticamente en cada PR y push a ramas de integración comprobaciones de tipos TypeScript, linter ESLint, formato Prettier, tests automatizados y compilación de producción.
- Definida por: `EPIC1/US3` (AC 3.1)
- Último cambio: `EPIC1` (2026-11-19)

### Sistema de diseño y guía visual

- Qué hace: Interfaz visual con tokens de diseño unificados (paleta terracota, lino y crema; tipografías Fraunces y DM Sans), componentes base accesibles con áreas táctiles mínimas y diseño responsivo adaptado a dispositivos móviles desde 360 px sin desbordamiento horizontal.
- Definida por: `EPIC1/US4` (AC 4.1, AC 4.2, AC 4.3)
- Último cambio: `EPIC1` (2026-11-19)
