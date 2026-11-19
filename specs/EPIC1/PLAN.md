# EPIC1 - Plan

## Estado

`closed`

## Orden de las historias

1. **US1 Proyecto base**: todo lo demás se apoya en ella.
2. **US2 Supabase conectado**: depende de US1. El código no necesita el proyecto real de Supabase; AC2.5 sí.
3. **US3 Despliegue automático**: depende de US1. Las comprobaciones de GitHub Actions van en el mismo PR; el despliegue necesita conectar el repo en Cloudflare (PM).
4. **US4 Guía visual**: depende de US1. Va al final porque necesita la aprobación del PM y, si los hay, el logo y colores de Clemen.

## Decisiones de entrega

- US1, US2 (código) y US3 (comprobaciones) se entregan juntas en un PR, porque por separado no se pueden probar.
- Despliegue con Workers Builds: Cloudflare compila cada push, da URL de prueba por rama y no hace falta guardar un token de Cloudflare en GitHub.
- La guía visual se propone como página de muestra (colores, tipografías y componentes) para que el PM la apruebe de un vistazo.

## Preguntas abiertas

- Ver `Acuerdo` en `EPIC1.md`.

## Aprobación

Aprobado por el PM (2026-11-19).
