const formateadorEuros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

/**
 * Formatea un precio guardado en céntimos como texto en euros, al estilo español:
 * 450 → "4,50 €". Los precios se guardan en céntimos para evitar errores de redondeo.
 */
export function formatearPrecio(centimos: number): string {
  if (!Number.isInteger(centimos) || centimos < 0) {
    throw new Error(`Precio no válido: ${centimos}. Debe ser un número entero de céntimos ≥ 0.`);
  }
  // Intl usa un espacio duro antes de "€"; se normaliza a espacio duro estrecho estándar (U+00A0).
  return formateadorEuros.format(centimos / 100).replace(/\s/g, " ");
}
