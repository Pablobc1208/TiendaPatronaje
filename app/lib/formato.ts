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

const TALLAS_EXCLUIDAS_CHIPS = new Set(["medida única", "medida unica", "talla única", "talla unica"]);

const ORDEN_LETRAS = [
  "3xs",
  "xxxs",
  "2xs",
  "xxs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "2xl",
  "xxl",
  "3xl",
  "xxxl",
  "4xl",
  "xxxxl",
];

/**
 * Comprueba si una talla es adecuada para mostrarse como chip de filtro.
 * Excluye "Medida única" y "Talla única" porque no representan un criterio de filtrado útil.
 */
export function esTallaValidaParaChip(talla: string): boolean {
  return !TALLAS_EXCLUIDAS_CHIPS.has(talla.trim().toLowerCase());
}

interface InformacionClasificacionTalla {
  grupo: number;
  valor: number;
  texto: string;
}

function obtenerNumeroCurvy(texto: string): number {
  const coincidenciaNumero = texto.match(/\d+/);
  return coincidenciaNumero ? parseInt(coincidenciaNumero[0]!, 10) : 0;
}

function clasificarTalla(talla: string): InformacionClasificacionTalla {
  const t = talla.trim().toLowerCase();

  if (/^\d+$/.test(t)) {
    return { grupo: 1, valor: parseInt(t, 10), texto: t };
  }

  if (t.includes("curvy")) {
    return { grupo: 2, valor: obtenerNumeroCurvy(t), texto: t };
  }

  const indiceLetra = ORDEN_LETRAS.indexOf(t);
  if (indiceLetra !== -1) {
    return { grupo: 3, valor: indiceLetra, texto: t };
  }

  return { grupo: 4, valor: 0, texto: t };
}

/**
 * Ordena las tallas para los chips del catálogo según la convención de la tienda:
 * 1. Numéricas de menor a mayor (36, 38...)
 * 2. Curvy por número (46 curvy, 48 curvy...)
 * 3. Letras en orden de confección (XS, S, M, L, XL, XXL)
 * Excluye "Medida única" y "Talla única".
 */
export function ordenarTallas(tallas: string[]): string[] {
  const tallasValidas = tallas.filter(esTallaValidaParaChip);

  return tallasValidas.sort((a, b) => {
    const infoA = clasificarTalla(a);
    const infoB = clasificarTalla(b);

    if (infoA.grupo !== infoB.grupo) {
      return infoA.grupo - infoB.grupo;
    }

    if (infoA.valor !== infoB.valor) {
      return infoA.valor - infoB.valor;
    }

    return infoA.texto.localeCompare(infoB.texto, "es", { sensitivity: "base" });
  });
}
