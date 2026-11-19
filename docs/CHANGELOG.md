# Registro de cambios

Una entrada con fecha por épica cerrada, la más reciente primero. Se escribe durante `Close`.

## [Sin publicar]

- (nada todavía)

## EPIC1 - Base técnica (2026-11-19)

- Proyecto base con React Router v8 y renderizado en servidor (SSR) sobre Node y Cloudflare Workers.
- Conexión e integración con Supabase mediante cookies de sesión y endpoint público de salud `GET /api/estado`.
- Pipeline de integración continua en GitHub Actions con verificación de tipos TypeScript, ESLint, Prettier, Vitest y compilación.
- Sistema de diseño y tokens de Tailwind CSS v4 implementados con la paleta cálida aprobada (crema, lino, tinta y terracota) y tipografías Fraunces y DM Sans.
- Página de inicio provisional adaptada para pantallas móviles (360 px), componente `ErrorBoundary` con 404 en español y configuración de `robots.txt` para excluir `/admin` y `/api/`.

## EPIC0 - Fundación (2026-11-19)

- Specs del proyecto (`specs/SPECS.md`) definidas con las respuestas del PM.
- Arquitectura documentada (`docs/ARCHITECTURE.md`): stack, estructura, tests y prácticas de desarrollo.
- Roadmap inicial (`docs/ROADMAP.md`) con 8 épicas y backlog.
- Constitución de los agentes (`AGENTS.md`) con idioma, reglas del proyecto y flujo de trabajo.
