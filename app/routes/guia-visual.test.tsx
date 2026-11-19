import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GuiaVisual, { meta } from "./guia-visual";

describe("GuiaVisual", () => {
  it("muestra las secciones de la guía", () => {
    render(<GuiaVisual />);
    for (const seccion of ["Colores", "Tipografía", "Botones", "Etiquetas y campos", "Tarjeta de producto"]) {
      expect(screen.getByRole("heading", { level: 2, name: seccion })).toBeInTheDocument();
    }
  });

  it("muestra el precio con IVA en las tarjetas de ejemplo", () => {
    render(<GuiaVisual />);
    expect(screen.getByText(/9,50\s€/)).toBeInTheDocument();
    expect(screen.getAllByText("IVA incl.", { exact: false })).toHaveLength(2);
  });

  it("no se indexa en buscadores", () => {
    expect(meta({} as Parameters<typeof meta>[0])).toContainEqual({ name: "robots", content: "noindex" });
  });
});
