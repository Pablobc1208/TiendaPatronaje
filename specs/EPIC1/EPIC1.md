# EPIC1 - Base técnica

## Problema

Tras EPIC0 el repo solo tiene documentación. Para construir el catálogo, el pago y el panel hace falta un proyecto que arranque en local, se compruebe solo en cada PR, esté conectado a Supabase y se publique en Cloudflare con una URL de pruebas.

## Objetivo

Dejar lista la base sobre la que se construyen las demás épicas: proyecto React Router + TypeScript con SSR en Cloudflare Workers, Supabase conectado, comprobaciones automáticas, despliegue automático y una guía visual aprobada.

## No-objetivos

- Tablas de la base de datos, catálogo o cualquier pantalla de la tienda más allá de una portada provisional (EPIC2 en adelante).
- Autenticación y panel `/admin` (EPIC5 y EPIC7).
- Tests e2e con Playwright: se montan en EPIC3 con el flujo de compra.
- Dominio propio (EPIC8).

## Historias de usuario

### US1

Como desarrollador, quiero un proyecto React Router + TypeScript con renderizado en servidor que funcione en local y compile para Cloudflare Workers, para empezar a construir la tienda sobre una base común.

Criterios de aceptación:

- **AC1.1** Dado el repo recién clonado, cuando ejecuto `npm install` y `npm run dev`, entonces la portada provisional se sirve renderizada en servidor, en español (`<html lang="es">`).
- **AC1.2** Dado el proyecto, cuando ejecuto `npm run build`, entonces se genera un Worker de Cloudflare que sirve la portada con `npm run preview`.
- **AC1.3** Dado el proyecto, cuando ejecuto `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm test`, entonces todos pasan.
- **AC1.4** Dada una ruta que no existe, cuando la visito, entonces recibo un 404 con un mensaje en español.
- **AC1.5** Dado `robots.txt`, cuando lo leo, entonces excluye `/admin` y `/api/`.

### US2

Como desarrollador, quiero la tienda conectada a Supabase mediante variables de entorno, para leer y escribir datos sin guardar secretos en el repo.

Criterios de aceptación:

- **AC2.1** Dado un loader o action, cuando necesita Supabase, entonces obtiene un cliente con `crearClienteSupabaseServidor(request, env)` que usa solo la clave pública y guarda la sesión en cookies.
- **AC2.2** Dadas variables ausentes o mal formadas, cuando se crea el cliente, entonces falla con un mensaje que nombra la variable y dónde configurarla.
- **AC2.3** Dada la tienda desplegada, cuando pido `GET /api/estado`, entonces responde 200 con `supabase.estado = "ok"` si Supabase responde, y 503 con el motivo (`sin_configurar` o `error`) si no.
- **AC2.4** Dado el repo, cuando lo reviso, entonces no contiene ninguna clave secreta y `.dev.vars` está en `.gitignore`.
- **AC2.5** Dado el proyecto de Supabase creado por el PM, cuando se configuran sus variables, entonces `/api/estado` en local y en Cloudflare responde `ok`.

### US3

Como PM, quiero que cada cambio se compruebe y se publique solo, para ver el avance en una URL de pruebas sin depender de nadie.

Criterios de aceptación:

- **AC3.1** Dado un PR, cuando se abre o se actualiza, entonces GitHub Actions ejecuta tipos, lint, formato, tests y build, y el PR muestra si pasan.
- **AC3.2** Dado un merge en `main`, cuando termina, entonces la tienda queda publicada en una URL `*.workers.dev`.
- **AC3.3** Dado un PR, cuando Cloudflare lo compila, entonces hay una URL de prueba de esa rama.

### US4

Como PM, quiero una guía visual única para la tienda, para que todas las pantallas tengan una imagen coherente y cuidada.

Criterios de aceptación:

- **AC4.1** Dada la propuesta del agente (colores, tipografías, espaciado, botones, tarjeta de producto), cuando el PM la revisa, entonces la aprueba o pide cambios sin rondas de referencias.
- **AC4.2** Dada la guía aprobada, cuando se implementa, entonces sus tokens están en `app/app.css` (`@theme`) y la portada provisional los usa.
- **AC4.3** Dada la guía, cuando se mira en un móvil de 360 px de ancho, entonces se lee bien y no hay scroll horizontal.

## Acuerdo

Resultado de la aclaración (`grill-me`). Los revisores comprueban el trabajo contra esta sección.

- Decisiones (2026-11-19, a partir del arranque pedido por el PM: Antigravity, Cloudflare, React y Supabase):
  - React Router v8 (la estable actual) en vez de v7, mismo modo framework.
  - TypeScript 6: typescript-eslint aún no admite TypeScript 7.
  - Despliegue con Cloudflare Workers Builds conectado al repo; GitHub Actions solo comprueba.
  - `/api/estado` como comprobación de despliegue y de conexión con Supabase.
- Riesgos:
  - Crear las cuentas de Supabase y Cloudflare depende del PM (US2 AC2.5, US3 AC3.2 y AC3.3).
- Preguntas abiertas:
  - Logo y colores actuales de Clemen para la guía visual (US4): si el PM no los aporta, el agente propone una guía desde cero.

## Ficheros relacionados

- `docs/ARCHITECTURE.md`
- `specs/EPIC1/PLAN.md`
- `specs/EPIC1/TASKS.md`
- `README.md`

## Retro

Se rellena al cerrar la épica.

- Mantener:
- Cambiar:
- Acción:
