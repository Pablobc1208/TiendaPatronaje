import type { JSX, ReactNode } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

/** Tipografías de la guía visual (Google Fonts), con preconexión para cargarlas antes. */
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap",
  },
];

function CabeceraDocumento(): JSX.Element {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
  );
}

export function Layout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="es">
      <CabeceraDocumento />
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Aplicacion(): JSX.Element {
  return <Outlet />;
}

interface InformacionError {
  titulo: string;
  detalle: string;
  traza?: string;
}

function obtenerInformacionError(error: unknown): InformacionError {
  if (isRouteErrorResponse(error)) {
    const es404 = error.status === 404;
    return {
      titulo: es404 ? "Página no encontrada" : `Error ${error.status}`,
      detalle: es404
        ? "La página que buscas no existe o se ha movido."
        : error.statusText || "Ha ocurrido un error inesperado.",
    };
  }
  if (import.meta.env.DEV && error instanceof Error) {
    return { titulo: "Algo ha ido mal", detalle: error.message, traza: error.stack };
  }
  return {
    titulo: "Algo ha ido mal",
    detalle: "Ha ocurrido un error inesperado. Vuelve a intentarlo en unos minutos.",
  };
}

/** Página de error común: 404 para rutas que no existen y mensaje genérico para el resto. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): JSX.Element {
  const { titulo, detalle, traza } = obtenerInformacionError(error);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">{titulo}</h1>
      <p className="mt-4">{detalle}</p>
      {traza && (
        <pre className="mt-6 overflow-x-auto text-sm">
          <code>{traza}</code>
        </pre>
      )}
    </main>
  );
}
