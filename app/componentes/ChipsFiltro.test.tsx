import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChipsFiltro } from "./ChipsFiltro";

describe("ChipsFiltro (AC 3.2)", () => {
  it("muestra la lista de tallas disponibles", () => {
    render(<ChipsFiltro tallas={["38", "40", "42", "Medida única"]} filtros={{}} />);

    expect(screen.getByRole("link", { name: "38" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "40" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "42" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Medida única" })).toBeInTheDocument();
  });

  it("marca la talla activa y construye la URL para deseleccionarla al pulsarla de nuevo", () => {
    render(<ChipsFiltro tallas={["38", "40"]} filtros={{ categoria: "flamenca", talla: "38" }} />);

    const chip38 = screen.getByRole("link", { name: "38" });
    expect(chip38).toHaveAttribute("aria-current", "true");
    expect(chip38).toHaveAttribute("href", "/patrones?categoria=flamenca");

    const chip40 = screen.getByRole("link", { name: "40" });
    expect(chip40).not.toHaveAttribute("aria-current");
    expect(chip40).toHaveAttribute("href", "/patrones?categoria=flamenca&talla=40");
  });

  it("no renderiza nada si no hay tallas disponibles", () => {
    const { container } = render(<ChipsFiltro tallas={[]} filtros={{}} />);
    expect(container.firstChild).toBeNull();
  });
});
