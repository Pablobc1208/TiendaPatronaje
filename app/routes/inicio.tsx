import type { Route } from "./+types/inicio";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Clemen Corbacho Patronaje" },
    { name: "description", content: "Patrones de costura en PDF para descargar." },
  ];
}

/** Portada provisional. El catálogo llega en EPIC2. */
export default function Inicio() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-semibold">Clemen Corbacho Patronaje</h1>
      <p className="mt-4 text-lg">Estamos preparando la nueva tienda de patrones. Muy pronto, aquí.</p>
    </main>
  );
}
