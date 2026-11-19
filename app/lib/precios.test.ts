import { describe, expect, it } from "vitest";

import { formatearPrecio } from "./precios";

describe("formatearPrecio", () => {
  it("formatea céntimos en euros con coma decimal", () => {
    expect(formatearPrecio(450)).toBe("4,50 €");
    expect(formatearPrecio(1250)).toBe("12,50 €");
  });

  it("muestra siempre dos decimales", () => {
    expect(formatearPrecio(300)).toBe("3,00 €");
    expect(formatearPrecio(0)).toBe("0,00 €");
  });

  it("usa separador de miles a partir de 10.000 €", () => {
    expect(formatearPrecio(1_234_500)).toBe("12.345,00 €");
  });

  it("rechaza decimales y negativos", () => {
    expect(() => formatearPrecio(4.5)).toThrow("Precio no válido");
    expect(() => formatearPrecio(-100)).toThrow("Precio no válido");
  });
});
