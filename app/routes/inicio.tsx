import type { JSX } from "react";
import { data } from "react-router";

import { TarjetaProducto } from "~/componentes/TarjetaProducto";
import type { Categoria, PatronConRelaciones } from "~/lib/catalogo.servidor";
import { obtenerCategorias, obtenerNovedades } from "~/lib/catalogo.servidor";
import { contextoCloudflare } from "~/lib/contexto";
import { crearClienteSupabaseServidor } from "~/lib/supabase.servidor";

import type { Route } from "./+types/inicio";

export function meta(_: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: "Clemen Corbacho Patronaje" },
    {
      name: "description",
      content: "Patrones de costura en PDF de Clemen Corbacho, claros, bien explicados y fáciles de usar.",
    },
  ];
}

/**
 * Carga las categorías oficiales y los patrones más recientes para la portada (AC 2.3).
 */
export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.get(contextoCloudflare);
  const { supabase, cabeceras } = crearClienteSupabaseServidor(request, env);

  const [categorias, novedades] = await Promise.all([
    obtenerCategorias(supabase),
    obtenerNovedades(supabase, 4),
  ]);

  return data({ categorias, novedades }, { headers: cabeceras });
}

/**
 * Sintetiza la lista de tallas de un patrón para mostrarla en la tarjeta.
 */
export function formatearResumenTallas(variantes?: Array<{ talla: string }>): string {
  if (!variantes || variantes.length === 0) return "Consultar";
  if (variantes.length === 1) return variantes[0]!.talla;

  const todasNumericas = variantes.every((v) => /^\d+$/.test(v.talla.trim()));
  if (todasNumericas) {
    const numeros = variantes.map((v) => parseInt(v.talla.trim(), 10));
    const min = Math.min(...numeros);
    const max = Math.max(...numeros);
    if (min === max) return `${min}`;
    return `${min} a ${max}`;
  }

  return variantes.map((v) => v.talla).join(", ");
}

/**
 * Hero principal con diseño tipográfico y biografía real de Clemen (AC 2.1).
 * Sin imágenes de stock para respetar la autenticidad del taller.
 */
function HeroBiografico(): JSX.Element {
  return (
    <section className="border-b border-hilo pt-4 pb-12 text-center sm:pb-16 sm:text-left">
      <p className="text-sm font-semibold tracking-wider text-terracota uppercase">
        Taller de costura artesanal
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-tinta sm:text-5xl lg:text-6xl">
        Clemen Corbacho Patronaje
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tinta-suave sm:text-xl">
        Clemen Corbacho cose de forma profesional desde los 12 años. Toda una vida dedicada a la aguja, el
        corte y la confección volcada en patrones digitales en PDF diseñados con precisión milimétrica para
        que cosas tus prendas a medida.
      </p>
    </section>
  );
}

/**
 * Accesos directos a las categorías oficiales (AC 2.2).
 */
function SeccionCategorias({
  categorias,
}: {
  categorias: Array<{ id: string; nombre: string; slug: string }>;
}): JSX.Element {
  return (
    <section className="py-12 sm:py-16">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-tinta sm:text-3xl">Categorías de patrones</h2>
          <p className="mt-1 text-sm text-tinta-suave">
            Explora las prendas por especialidad y encuentra tu próximo proyecto de costura.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categorias.map((categoria) => (
          <a
            key={categoria.id}
            href={`/patrones?categoria=${categoria.slug}`}
            /* Área táctil mínima de 44 px (WCAG 2.5.5) */
            className="group flex min-h-12 items-center justify-center rounded-tarjeta border border-hilo bg-white p-4 text-center font-medium text-tinta shadow-xs transition-all hover:border-terracota hover:bg-lino hover:text-terracota focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
          >
            <span className="text-base group-hover:font-semibold">{categoria.nombre}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * Sección de Novedades con los últimos 4 patrones activos usando TarjetaProducto (AC 2.3).
 */
function SeccionNovedades({ novedades }: { novedades: PatronConRelaciones[] }): JSX.Element {
  if (!novedades || novedades.length === 0) {
    return <></>;
  }

  return (
    <section className="border-t border-hilo py-12 sm:py-16">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-tinta sm:text-3xl">Novedades del taller</h2>
          <p className="mt-1 text-sm text-tinta-suave">
            Los últimos patrones confeccionados, listos para descargar y empezar a coser.
          </p>
        </div>
        <a
          href="/patrones"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-terracota hover:text-terracota-oscuro"
        >
          Ver todo el catálogo &rarr;
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {novedades.map((patron) => (
          <TarjetaProducto
            key={patron.id}
            nombre={patron.nombre}
            precioDesdeCentimos={patron.precio_desde_centimos}
            tallas={formatearResumenTallas(patron.variantes)}
            nivel={patron.nivel ?? undefined}
            enlace={`/patrones/${patron.slug}`}
          />
        ))}
      </div>
    </section>
  );
}

function PieInicio(): JSX.Element {
  return (
    <footer className="mt-12 border-t border-hilo pt-8 text-center text-xs text-tinta-suave">
      &copy; {new Date().getFullYear()} Clemen Corbacho. Todos los derechos reservados.
    </footer>
  );
}

export interface PropsInicio {
  loaderData?: {
    categorias?: Categoria[];
    novedades?: PatronConRelaciones[];
  };
}

/**
 * Portada de la tienda (US2).
 */
export default function Inicio({ loaderData }: PropsInicio): JSX.Element {
  const categorias = loaderData?.categorias ?? [];
  const novedades = loaderData?.novedades ?? [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <HeroBiografico />
      <SeccionCategorias categorias={categorias} />
      <SeccionNovedades novedades={novedades} />
      <PieInicio />
    </main>
  );
}
