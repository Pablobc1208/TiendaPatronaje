import { Etiqueta } from "~/componentes/Etiqueta";

import type { Route } from "./+types/inicio";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Clemen Corbacho Patronaje" },
    { name: "description", content: "Patrones de costura en PDF para descargar." },
  ];
}

/** Portada provisional con la guía visual aplicada. El catálogo completo llega en EPIC2. */
export default function Inicio() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-12 sm:py-16">
      <header className="space-y-3 text-center sm:text-left">
        <Etiqueta>Próximamente</Etiqueta>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Clemen Corbacho Patronaje</h1>
        <p className="text-base text-tinta-suave sm:text-lg">
          Estamos preparando la nueva tienda de patrones de costura en PDF. Descargas directas, explicaciones
          paso a paso y atención al detalle.
        </p>
      </header>

      <section className="mt-8 rounded-tarjeta border border-hilo bg-lino p-6">
        <h2 className="text-lg font-semibold">Artesanía y precisión en cada patrón</h2>
        <p className="mt-2 text-sm text-tinta-suave">
          Muy pronto podrás explorar nuestro catálogo de prendas con selector de talla e instrucciones
          detalladas.
        </p>
      </section>

      <footer className="mt-12 text-center text-xs text-tinta-suave">
        &copy; {new Date().getFullYear()} Clemen Corbacho. Todos los derechos reservados.
      </footer>
    </main>
  );
}
