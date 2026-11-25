import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OrdenSelector } from "./OrdenSelector";

describe("OrdenSelector (AC 3.3)", () => {
  it("muestra las 3 opciones de ordenación requeridas", () => {
    render(<OrdenSelector filtros={{}} />);

    const select = screen.getByRole("combobox", { name: /ordenar por/i });
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Novedades" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Precio menor a mayor" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Precio mayor a menor" })).toBeInTheDocument();
  });

  it("selecciona la opción activa según los filtros", () => {
    render(<OrdenSelector filtros={{ orden: "precio-asc" }} />);

    const select = screen.getByRole("combobox", { name: /ordenar por/i });
    expect(select).toHaveValue("precio-asc");
  });

  it("preserva los filtros de categoría, talla y búsqueda en campos ocultos", () => {
    const { container } = render(
      <OrdenSelector filtros={{ categoria: "flamenca", talla: "40", busqueda: "vestido" }} />,
    );

    const inputCategoria = container.querySelector<HTMLInputElement>('input[name="categoria"]');
    const inputTalla = container.querySelector<HTMLInputElement>('input[name="talla"]');
    const inputBusqueda = container.querySelector<HTMLInputElement>('input[name="q"]');

    expect(inputCategoria?.value).toBe("flamenca");
    expect(inputTalla?.value).toBe("40");
    expect(inputBusqueda?.value).toBe("vestido");
  });

  it("solicita el envío del formulario al cambiar la opción seleccionada", () => {
    const { container } = render(<OrdenSelector filtros={{}} />);
    const formulario = container.querySelector("form");
    expect(formulario).not.toBeNull();

    const peticionEnvio = vi.fn();
    formulario!.requestSubmit = peticionEnvio;

    const select = screen.getByRole("combobox", { name: /ordenar por/i });
    fireEvent.change(select, { target: { value: "precio-desc" } });

    expect(peticionEnvio).toHaveBeenCalledTimes(1);
  });
});
