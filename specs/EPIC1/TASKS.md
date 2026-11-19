# EPIC1 - Tareas

## Estado

`WIP` (pendiente de aprobación del PM)

## US1: Como desarrollador, quiero un proyecto React Router + TypeScript con renderizado en servidor que funcione en local y compile para Cloudflare Workers, para empezar a construir la tienda sobre una base común

[<] [T0] Crear el proyecto: `package.json` con scripts, React Router v8 con SSR, Vite con el plugin de Cloudflare, `wrangler.jsonc`, `workers/app.ts`, TypeScript `strict` y Tailwind v4. (AC 1.1, 1.2)
[<] [T1] Portada provisional en español y `ErrorBoundary` con 404 en español en `app/root.tsx`. (AC 1.1, 1.4)
[<] [T2] ESLint, Prettier y Vitest + Testing Library con un test de la portada. (AC 1.3)
[<] [T3] `public/robots.txt` que excluye `/admin` y `/api/`. (AC 1.5)

## US2: Como desarrollador, quiero la tienda conectada a Supabase mediante variables de entorno, para leer y escribir datos sin guardar secretos en el repo

[<] [T4] Contexto de Cloudflare para loaders y actions (`app/lib/contexto.ts`) y lectura validada de la configuración de Supabase, con tests. (AC 2.2)
[<] [T5] `crearClienteSupabaseServidor` con `@supabase/ssr` y sesión en cookies. (AC 2.1)
[<] [T6] `GET /api/estado` que comprueba la salud de Supabase, con tests. (AC 2.3)
[<] [T7] `.dev.vars.example`, `.gitignore` y carpeta `supabase/` (migraciones, funciones, seed). (AC 2.4)
[-] [T8] Crear el proyecto de Supabase (hecho por el PM: `TiendaPatronaje`, eu-west-1), poner su URL y clave pública en `wrangler.jsonc` (hecho) y comprobar `/api/estado` en local (PM) y en Cloudflare (tras T10). (AC 2.5)

## US3: Como PM, quiero que cada cambio se compruebe y se publique solo, para ver el avance en una URL de pruebas sin depender de nadie

[<] [T9] Workflow de GitHub Actions con tipos, lint, formato, tests y build en cada PR y en `main`. (AC 3.1)
[!] [T10] [Blocked by PM] Conectar el repo en Cloudflare Workers Builds (producción `main` y builds de ramas) y comprobar la URL `*.workers.dev`. (AC 3.2, 3.3)

## US4 (guía desde cero, sin logo ni colores previos; decisión del PM 2026-11-19): Como PM, quiero una guía visual única para la tienda, para que todas las pantallas tengan una imagen coherente y cuidada

[<] [T11] Proponer la guía visual (colores, tipografías, espaciado, botones, tarjeta de producto) como página de muestra y pedir la aprobación del PM. (AC 4.1)
[-] [T12] [Blocked by T11] Pasar la guía aprobada a tokens en `app/app.css` y aplicarla a la portada provisional, comprobando 360 px de ancho. (AC 4.2, 4.3)
