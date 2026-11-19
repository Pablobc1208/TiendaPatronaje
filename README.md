# Tienda Clemen Corbacho Patronaje

Nueva tienda online de patrones de costura en PDF. Sustituye a https://clemencorbachopatronaje.es/.

- Qué es y por qué: [`specs/SPECS.md`](specs/SPECS.md)
- Stack y convenciones: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Épicas y estado: [`docs/ROADMAP.md`](docs/ROADMAP.md)
- Cómo trabajamos (Agile SDD): [`AGENTS.md`](AGENTS.md) y [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md)

## Requisitos

- Node 22.22 o superior (`.nvmrc`) y npm.
- Una cuenta de Supabase y otra de Cloudflare (gratis para empezar).

## Arrancar en local

```bash
npm install
npm run dev                      # http://localhost:5173
```

La URL y la clave pública de Supabase ya están en `wrangler.jsonc`. Si quieres apuntar a otro proyecto en local, crea `.dev.vars` a partir de `.dev.vars.example`: sus valores tienen prioridad.

`npm run dev` ejecuta la tienda dentro del runtime de Cloudflare (workerd), igual que en producción. La propuesta de guía visual se ve en http://localhost:5173/guia-visual. Para comprobar que Supabase está bien conectado, abre http://localhost:5173/api/estado: debe responder `"supabase": { "estado": "ok" }`.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila la tienda para Cloudflare Workers |
| `npm run preview` | Compila y sirve el resultado en local, como en producción |
| `npm run typecheck` | Genera los tipos (Cloudflare y rutas) y comprueba TypeScript |
| `npm run lint` | ESLint |
| `npm run format` / `format:check` | Prettier (escribe / solo comprueba) |
| `npm test` | Tests unitarios con Vitest |
| `npm run deploy` | Compila y publica en Cloudflare a mano con Wrangler |

GitHub Actions (`.github/workflows/comprobaciones.yml`) ejecuta tipos, lint, formato, tests y build en cada PR.

## Configurar Supabase (una vez)

1. Crea un proyecto en https://supabase.com/dashboard (región Europa, por ejemplo `eu-west-3` París).
2. En **Project Settings > API** copia la **Project URL** y la **Publishable key**.
3. Ponlas en `.dev.vars` para trabajar en local y en `vars` de `wrangler.jsonc` para Cloudflare. Son públicas (las ve el navegador); la seguridad la da Row Level Security.
4. Nunca subas la `secret key` / `service_role`: va solo en los secretos de Cloudflare y de las Edge Functions.

## Desplegar en Cloudflare (una vez)

Recomendado: **Workers Builds**, que despliega solo desde GitHub.

1. En https://dash.cloudflare.com ve a **Workers & Pages > Create > Import a repository** y elige `Pablobc1208/TiendaPatronaje`.
2. Comando de build: `npm run build`. Comando de despliegue: `npx wrangler deploy`. Rama de producción: `main`.
3. Activa las builds de otras ramas para tener una URL de prueba por cada PR.

Cada push a `main` queda publicado en `https://tienda-patronaje.<tu-subdominio>.workers.dev`. El dominio propio se decide en EPIC8.

## Estructura

```
app/                  # React Router: rutas, componentes y lógica
  routes/             # páginas y endpoints (ver app/routes.ts)
  componentes/        # componentes de interfaz reutilizables
  lib/                # cliente Supabase, configuración, utilidades
  root.tsx            # documento HTML, layout y página de error
workers/app.ts        # punto de entrada del Worker de Cloudflare
supabase/             # migraciones SQL, Edge Functions y datos de prueba
tests/                # preparación de Vitest y tests e2e (Playwright, EPIC3)
public/               # ficheros estáticos (robots.txt, favicon…)
wrangler.jsonc        # configuración del Worker
```
