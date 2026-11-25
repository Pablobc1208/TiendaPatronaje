export interface ParametrosFiltros {
  categoria?: string;
  talla?: string;
  orden?: "novedad" | "precio-asc" | "precio-desc";
  busqueda?: string;
}

function asignarSiPresente(params: URLSearchParams, clave: string, valor?: string): void {
  if (valor && valor.trim() !== "") {
    params.set(clave, valor.trim());
  }
}

/**
 * Construye una URL con los parámetros de búsqueda normalizados según el estándar de la tienda:
 * ?categoria=<slug>&talla=<talla>&orden=<opcion>&q=<termino>
 */
export function construirUrlFiltros(
  pathname: string,
  filtros: ParametrosFiltros,
  cambios: Partial<ParametrosFiltros> = {},
): string {
  const params = new URLSearchParams();
  const estadoFinal = { ...filtros, ...cambios };

  asignarSiPresente(params, "categoria", estadoFinal.categoria);
  asignarSiPresente(params, "talla", estadoFinal.talla);
  if (estadoFinal.orden && estadoFinal.orden !== "novedad") {
    params.set("orden", estadoFinal.orden);
  }
  asignarSiPresente(params, "q", estadoFinal.busqueda);

  const cadenaConsulta = params.toString();
  return cadenaConsulta ? `${pathname}?${cadenaConsulta}` : pathname;
}
