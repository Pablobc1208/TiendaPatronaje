import type { JSX } from "react";
import { data } from "react-router";

import { ChipsFiltro } from "~/componentes/ChipsFiltro";
import { EstadoSinResultados } from "~/componentes/EstadoSinResultados";
import { OrdenSelector } from "~/componentes/OrdenSelector";
import { PestaniasCategorias } from "~/componentes/PestaniasCategorias";
import { TarjetaProducto } from "~/componentes/TarjetaProducto";
import type { Categoria, FiltrosCatalogo, PatronConRelaciones } from "~/lib/catalogo.servidor";
import { obtenerCategorias, obtenerPatrones, obtenerTallasDisponibles } from "~/lib/catalogo.servidor";
import { contextoCloudflare } from "~/lib/contexto";
import { formatearResumenTallas } from "~/lib/formato";
import { crearClienteSupabaseServidor } from "~/lib/supabase.servidor";

import type { Route } from "./+types/patrones._index";

export function meta(_: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: "Catálogo de patrones | Clemen Corbacho Patronaje" },
    {
      name: "description",
      content: "Explora la colección completa de patrones de costura en PDF de Clemen Corbacho.",
    },
  ];
}

export interface FiltrosActivos {
  categoria?: string;
  talla?: string;
  orden?: "novedad" | "precio-asc" | "precio-desc";
  busqueda?: string;
}

export interface DatosCatalogo {
  patrones: PatronConRelaciones[];
  categorias: Categoria[];
  tallasDisponibles: string[];
  filtros: FiltrosActivos;
}

function parsearFiltrosUrl(url: URL): FiltrosActivos {
  const categoria = url.searchParams.get("categoria") ?? undefined;
  const talla = url.searchParams.get("talla") ?? undefined;
  const ordenParam = url.searchParams.get("orden");
  const orden =
    ordenParam === "precio-asc" || ordenParam === "precio-desc" || ordenParam === "novedad"
      ? ordenParam
      : undefined;
  const busqueda = url.searchParams.get("q") ?? undefined;

  return { categoria, talla, orden, busqueda };
}

/**
 * Loader que consulta los patrones aplicando los filtros recibidos por URL.
 */
export async function loader({
  request,
  context,
}: Route.LoaderArgs): Promise<ReturnType<typeof data<DatosCatalogo>>> {
  const url = new URL(request.url);
  const filtros = parsearFiltrosUrl(url);

  const { env } = context.get(contextoCloudflare);
  const { supabase, cabeceras } = crearClienteSupabaseServidor(request, env);

  const filtrosConsulta: FiltrosCatalogo = {
    categoriaSlug: filtros.categoria,
    talla: filtros.talla,
    orden: filtros.orden,
    busqueda: filtros.busqueda,
  };

  const [patrones, categorias, tallasDisponibles] = await Promise.all([
    obtenerPatrones(supabase, filtrosConsulta),
    obtenerCategorias(supabase),
    obtenerTallasDisponibles(supabase),
  ]);

  return data({ patrones, categorias, tallasDisponibles, filtros }, { headers: cabeceras });
}

function EncabezadoCatalogo(): JSX.Element {
  return (
    <div className="border-b border-hilo pb-8 text-center sm:text-left">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-tinta sm:text-4xl">
        Catálogo de patrones
      </h1>
      <p className="mt-2 text-base text-tinta-suave">
        Patrones de costura en PDF, claros, bien explicados y fáciles de usar.
      </p>
    </div>
  );
}

function CuadriculaPatrones({ patrones }: { patrones: PatronConRelaciones[] }): JSX.Element {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {patrones.map((patron) => (
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
  );
}

interface PropsBarraFiltros {
  tallas: string[];
  filtros: FiltrosActivos;
}

function BarraFiltros({ tallas, filtros }: PropsBarraFiltros): JSX.Element {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <ChipsFiltro tallas={tallas} filtros={filtros} />
      <OrdenSelector filtros={filtros} />
    </div>
  );
}

export interface PropsCatalogoPatrones {
  loaderData?: DatosCatalogo;
}

export default function CatalogoPatrones({ loaderData }: PropsCatalogoPatrones): JSX.Element {
  const patrones = loaderData?.patrones ?? [];
  const categorias = loaderData?.categorias ?? [];
  const tallasDisponibles = loaderData?.tallasDisponibles ?? [];
  const filtros = loaderData?.filtros ?? {};

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <EncabezadoCatalogo />
      <PestaniasCategorias categorias={categorias} filtros={filtros} />
      <BarraFiltros tallas={tallasDisponibles} filtros={filtros} />
      {patrones.length === 0 ? <EstadoSinResultados /> : <CuadriculaPatrones patrones={patrones} />}
    </main>
  );
}
