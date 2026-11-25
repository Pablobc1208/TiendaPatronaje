import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EstadoSinResultados } from "./EstadoSinResultados";

describe("EstadoSinResultados (AC 3.4)", () => {
  it("muestra el mensaje informativo y el botón para quitar filtros", () => {
    render(<EstadoSinResultados />);

    expect(
      screen.getByText("No encontramos ningún patrón con los filtros seleccionados."),
    ).toBeInTheDocument();

    const boton = screen.getByRole("link", { name: /quitar filtros/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toHaveAttribute("href", "/patrones");
  });

  it("permite personalizar el mensaje y el destino del botón", () => {
    render(
      <EstadoSinResultados
        mensaje="No encontramos patrones para «volantes»"
        textoBoton="Ver todo el catálogo"
        href="/patrones"
      />,
    );

    expect(screen.getByText("No encontramos patrones para «volantes»")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver todo el catálogo" })).toHaveAttribute("href", "/patrones");
  });
});
