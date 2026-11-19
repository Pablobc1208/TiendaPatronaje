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
        <span className="inline-block rounded-full bg-secundario/20 px-3 py-1 text-xs font-semibold tracking-wider text-primario uppercase">
          Próximamente
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-texto sm:text-4xl">
          Clemen Corbacho Patronaje
        </h1>
        <p className="text-base text-texto-suave sm:text-lg">
          Estamos preparando la nueva tienda de patrones de costura en PDF. Descargas directas, explicaciones paso a
          paso y atención al detalle.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-borde bg-superficie p-6 shadow-xs">
        <h2 className="font-serif text-lg font-semibold text-texto">Artesanía y precisión en cada patrón</h2>
        <p className="mt-2 text-sm text-texto-suave">
          Muy pronto podrás explorar nuestro catálogo de prendas con selector de talla e instrucciones detalladas.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-acento px-6 py-3 text-sm font-medium text-white transition hover:bg-acento-oscuro"
          >
            Avisarme del lanzamiento
          </button>
          <a
            href="mailto:contacto@clemencorbacho.com"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-primario px-6 py-3 text-sm font-medium text-primario transition hover:bg-primario hover:text-white"
          >
            Contacto
          </a>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-texto-suave">
        &copy; {new Date().getFullYear()} Clemen Corbacho. Todos los derechos reservados.
      </footer>
    </main>
  );
}
