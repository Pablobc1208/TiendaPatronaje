import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Aplicacion() {
  return <Outlet />;
}

/** Página de error común: 404 para rutas que no existen y mensaje genérico para el resto. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let titulo = "Algo ha ido mal";
  let detalle = "Ha ocurrido un error inesperado. Vuelve a intentarlo en unos minutos.";
  let traza: string | undefined;

  if (isRouteErrorResponse(error)) {
    titulo = error.status === 404 ? "Página no encontrada" : `Error ${error.status}`;
    detalle =
      error.status === 404 ? "La página que buscas no existe o se ha movido." : error.statusText || detalle;
  } else if (import.meta.env.DEV && error instanceof Error) {
    detalle = error.message;
    traza = error.stack;
  }

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
