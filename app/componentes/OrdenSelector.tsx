import type { ChangeEvent, JSX } from "react";

import type { ParametrosFiltros } from "~/lib/filtros";

interface PropsCamposOcultos {
  filtros: ParametrosFiltros;
}

function CamposOcultosFiltros({ filtros }: PropsCamposOcultos): JSX.Element {
  return (
    <>
      {filtros.categoria && <input type="hidden" name="categoria" value={filtros.categoria} />}
      {filtros.talla && <input type="hidden" name="talla" value={filtros.talla} />}
      {filtros.busqueda && <input type="hidden" name="q" value={filtros.busqueda} />}
    </>
  );
}

interface PropsDesplegableOrden {
  orden?: string;
  alCambiar: (evento: ChangeEvent<HTMLSelectElement>) => void;
}

function DesplegableOrden({ orden, alCambiar }: PropsDesplegableOrden): JSX.Element {
  return (
    <select
      id="selector-orden"
      name="orden"
      value={orden ?? "novedad"}
      onChange={alCambiar}
      className="min-h-11 rounded-tarjeta border border-hilo bg-white px-3 py-2 text-sm font-medium text-tinta shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
    >
      <option value="novedad">Novedades</option>
      <option value="precio-asc">Precio menor a mayor</option>
      <option value="precio-desc">Precio mayor a menor</option>
    </select>
  );
}

export interface PropsOrdenSelector {
  filtros: ParametrosFiltros;
}

/**
 * Selector de ordenación del catálogo (AC 3.3).
 * Funciona con o sin JavaScript preservando el resto de filtros activos.
 */
export function OrdenSelector({ filtros }: PropsOrdenSelector): JSX.Element {
  const alCambiarOrden = (evento: ChangeEvent<HTMLSelectElement>) => {
    evento.currentTarget.form?.requestSubmit();
  };

  return (
    <form method="get" action="/patrones" className="flex items-center gap-2">
      <CamposOcultosFiltros filtros={filtros} />
      <label htmlFor="selector-orden" className="text-sm font-medium whitespace-nowrap text-tinta-suave">
        Ordenar por:
      </label>
      <DesplegableOrden orden={filtros.orden} alCambiar={alCambiarOrden} />
      <noscript>
        <button type="submit" className="min-h-11 rounded-boton bg-terracota px-3 py-2 text-sm text-white">
          Aplicar
        </button>
      </noscript>
    </form>
  );
}
