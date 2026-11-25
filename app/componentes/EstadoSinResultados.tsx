import type { JSX } from "react";

import { EnlaceBoton } from "~/componentes/Boton";

export interface PropsEstadoSinResultados {
  mensaje?: string;
  subtexto?: string;
  textoBoton?: string;
  href?: string;
}

/**
 * Mensaje mostrado cuando una combinación de filtros o búsqueda no arroja patrones (AC 3.4).
 */
export function EstadoSinResultados({
  mensaje = "No encontramos ningún patrón con los filtros seleccionados.",
  subtexto = "Prueba a cambiar de categoría o restablece los filtros para ver más opciones.",
  textoBoton = "Quitar filtros",
  href = "/patrones",
}: PropsEstadoSinResultados): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-tarjeta border border-dashed border-hilo bg-white p-8 text-center sm:p-12">
      <p className="text-lg font-semibold text-tinta">{mensaje}</p>
      {subtexto && <p className="mt-2 text-sm text-tinta-suave">{subtexto}</p>}
      <div className="mt-6">
        <EnlaceBoton href={href} variante="principal">
          {textoBoton}
        </EnlaceBoton>
      </div>
    </div>
  );
}
