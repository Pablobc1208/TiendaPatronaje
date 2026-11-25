import { describe, expect, it } from "vitest";

import { esTallaValidaParaChip, formatearResumenTallas, ordenarTallas } from "./formato";

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

describe("esTallaValidaParaChip", () => {
  it("excluye 'Medida única' y 'Talla única' en cualquier variante de mayúsculas/acentos", () => {
    expect(esTallaValidaParaChip("Medida única")).toBe(false);
    expect(esTallaValidaParaChip("medida unica")).toBe(false);
    expect(esTallaValidaParaChip("Talla única")).toBe(false);
    expect(esTallaValidaParaChip("TALLA UNICA")).toBe(false);
  });

  it("admite tallas estándar", () => {
    expect(esTallaValidaParaChip("38")).toBe(true);
    expect(esTallaValidaParaChip("48 curvy")).toBe(true);
    expect(esTallaValidaParaChip("M")).toBe(true);
  });
});

describe("ordenarTallas", () => {
  it("ordena primero numéricas (menor a mayor), luego curvy por número, después letras en orden textil", () => {
    const desordenadas = [
      "XL",
      "48 curvy",
      "Medida única",
      "38",
      "M",
      "42",
      "46 curvy",
      "XS",
      "Talla única",
      "S",
      "L",
      "XXL",
      "36",
    ];

    const resultado = ordenarTallas(desordenadas);

    expect(resultado).toEqual([
      // 1. Numéricas
      "36",
      "38",
      "42",
      // 2. Curvy
      "46 curvy",
      "48 curvy",
      // 3. Letras
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ]);
  });
});
