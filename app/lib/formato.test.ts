import { describe, expect, it } from "vitest";

import { formatearResumenTallas } from "./formato";

describe("formatearResumenTallas", () => {
  it("devuelve 'Consultar' cuando no hay variantes", () => {
    expect(formatearResumenTallas()).toBe("Consultar");
    expect(formatearResumenTallas([])).toBe("Consultar");
  });

  it("devuelve la talla individual si solo hay una variante", () => {
    expect(formatearResumenTallas([{ talla: "Medida única" }])).toBe("Medida única");
    expect(formatearResumenTallas([{ talla: "38" }])).toBe("38");
  });

  it("muestra el rango de tallas numéricas", () => {
    expect(formatearResumenTallas([{ talla: "38" }, { talla: "40" }, { talla: "42" }])).toBe("38 a 42");
  });

  it("muestra una sola talla si todas las variantes numéricas son iguales", () => {
    expect(formatearResumenTallas([{ talla: "40" }, { talla: "40" }])).toBe("40");
  });

  it("enumera las tallas separadas por coma cuando hay mezclas no numéricas", () => {
    expect(formatearResumenTallas([{ talla: "42" }, { talla: "48 curvy" }])).toBe("42, 48 curvy");
  });
});
