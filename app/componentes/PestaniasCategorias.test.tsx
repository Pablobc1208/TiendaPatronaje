import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Categoria } from "~/lib/catalogo.servidor";

import { PestaniasCategorias } from "./PestaniasCategorias";

const categoriasMock: Categoria[] = [
  { id: "1", nombre: "Flamenca", slug: "flamenca", creada_en: "2026-11-20" },
  { id: "2", nombre: "Señora", slug: "senora", creada_en: "2026-11-20" },
  { id: "3", nombre: "Caballero", slug: "caballero", creada_en: "2026-11-20" },
  { id: "4", nombre: "Complementos", slug: "complementos", creada_en: "2026-11-20" },
  { id: "5", nombre: "Patrones base", slug: "patrones-base", creada_en: "2026-11-20" },
];

describe("PestaniasCategorias (AC 3.1)", () => {
  it("muestra la pestaña 'Todas' y las 5 categorías oficiales", () => {
    render(<PestaniasCategorias categorias={categoriasMock} filtros={{}} />);

    expect(screen.getByRole("link", { name: "Todas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Flamenca" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Señora" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Caballero" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Complementos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Patrones base" })).toBeInTheDocument();
  });

  it("marca 'Todas' como activa si no hay categoría seleccionada", () => {
    render(<PestaniasCategorias categorias={categoriasMock} filtros={{}} />);

    const todas = screen.getByRole("link", { name: "Todas" });
    expect(todas).toHaveAttribute("aria-current", "page");
  });

  it("marca la categoría activa según los filtros y construye las URLs preservando otros parámetros", () => {
    render(
      <PestaniasCategorias categorias={categoriasMock} filtros={{ categoria: "flamenca", talla: "42" }} />,
    );

    const flamenca = screen.getByRole("link", { name: "Flamenca" });
    expect(flamenca).toHaveAttribute("aria-current", "page");

    const senora = screen.getByRole("link", { name: "Señora" });
    expect(senora).not.toHaveAttribute("aria-current");
    expect(senora).toHaveAttribute("href", "/patrones?categoria=senora&talla=42");

    const todas = screen.getByRole("link", { name: "Todas" });
    expect(todas).not.toHaveAttribute("aria-current");
    expect(todas).toHaveAttribute("href", "/patrones?talla=42");
  });
});
