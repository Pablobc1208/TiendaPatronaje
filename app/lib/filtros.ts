export interface ParametrosFiltros {
  categoria?: string;
  talla?: string;
  orden?: "novedad" | "precio-asc" | "precio-desc";
  busqueda?: string;
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

  if (estadoFinal.categoria && estadoFinal.categoria.trim() !== "") {
    params.set("categoria", estadoFinal.categoria.trim());
  }

  if (estadoFinal.talla && estadoFinal.talla.trim() !== "") {
    params.set("talla", estadoFinal.talla.trim());
  }

  if (estadoFinal.orden && estadoFinal.orden !== "novedad") {
    params.set("orden", estadoFinal.orden);
  }

  if (estadoFinal.busqueda && estadoFinal.busqueda.trim() !== "") {
    params.set("q", estadoFinal.busqueda.trim());
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
