/**
 * Sintetiza la lista de tallas de un patrón para mostrarla en la tarjeta.
 * Si todas son numéricas, muestra un rango ("36 a 48"). En caso contrario, las enumera.
 */
export function formatearResumenTallas(variantes?: Array<{ talla: string }>): string {
  if (!variantes || variantes.length === 0) return "Consultar";
  if (variantes.length === 1) return variantes[0]!.talla;

  const todasNumericas = variantes.every((v) => /^\d+$/.test(v.talla.trim()));
  if (todasNumericas) {
    const numeros = variantes.map((v) => parseInt(v.talla.trim(), 10));
    const min = Math.min(...numeros);
    const max = Math.max(...numeros);
    if (min === max) return `${min}`;
    return `${min} a ${max}`;
  }

  return variantes.map((v) => v.talla).join(", ");
}
