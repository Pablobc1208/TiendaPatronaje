import { describe, expect, it } from "vitest";

import { construirUrlFiltros } from "./filtros";

describe("construirUrlFiltros", () => {
  it("genera la ruta base cuando no hay filtros activos", () => {
    expect(construirUrlFiltros("/patrones", {})).toBe("/patrones");
  });

  it("mantiene y actualiza la categoría preservando otros filtros", () => {
    const url = construirUrlFiltros(
      "/patrones",
      { categoria: "flamenca", talla: "40", orden: "precio-asc" },
      { categoria: "senora" },
    );
    expect(url).toBe("/patrones?categoria=senora&talla=40&orden=precio-asc");
  });

  it("elimina la categoría al seleccionar 'Todas' pasando undefined", () => {
    const url = construirUrlFiltros(
      "/patrones",
      { categoria: "flamenca", talla: "40" },
      { categoria: undefined },
    );
    expect(url).toBe("/patrones?talla=40");
  });

  it("permite alternar la talla seleccionada", () => {
    const urlActiva = construirUrlFiltros("/patrones", { categoria: "flamenca" }, { talla: "42" });
    expect(urlActiva).toBe("/patrones?categoria=flamenca&talla=42");

    const urlDesactivada = construirUrlFiltros(
      "/patrones",
      { categoria: "flamenca", talla: "42" },
      { talla: undefined },
    );
    expect(urlDesactivada).toBe("/patrones?categoria=flamenca");
  });

  it("no incluye 'orden=novedad' al ser el valor por defecto", () => {
    const url = construirUrlFiltros("/patrones", {}, { orden: "novedad" });
    expect(url).toBe("/patrones");
  });

  it("incluye el término de búsqueda con el parámetro q", () => {
    const url = construirUrlFiltros("/patrones", { categoria: "flamenca" }, { busqueda: "volantes" });
    expect(url).toBe("/patrones?categoria=flamenca&q=volantes");
  });
});
