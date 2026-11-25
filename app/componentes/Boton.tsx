import type { AnchorHTMLAttributes, ButtonHTMLAttributes, JSX } from "react";

export type VarianteBoton = "principal" | "secundario" | "fantasma";

const estilosVariante: Record<VarianteBoton, string> = {
  principal: "bg-terracota text-white hover:bg-terracota-oscuro",
  secundario: "border border-tinta bg-transparent text-tinta hover:bg-lino",
  fantasma: "bg-transparent text-terracota underline-offset-4 hover:underline",
};

interface PropsBotonBase {
  variante?: VarianteBoton;
  /** Ocupa todo el ancho (útil en móvil, p. ej. "Añadir al carrito"). */
  anchoCompleto?: boolean;
}

interface PropsBoton extends ButtonHTMLAttributes<HTMLButtonElement>, PropsBotonBase {}

interface PropsEnlaceBoton extends AnchorHTMLAttributes<HTMLAnchorElement>, PropsBotonBase {}

export function obtenerClasesBoton(
  variante: VarianteBoton = "principal",
  anchoCompleto: boolean = false,
  className: string = "",
): string {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-boton px-5 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota";
  const varianteClase = estilosVariante[variante];
  const anchoClase = anchoCompleto ? "w-full" : "";
  return `${base} ${varianteClase} ${anchoClase} ${className}`.trim();
}

/** Botón de la guía visual. Altura mínima de 44 px para pulsarlo bien en el móvil. */
export function Boton({
  variante = "principal",
  anchoCompleto = false,
  className = "",
  type = "button",
  ...resto
}: PropsBoton): JSX.Element {
  return (
    <button
      type={type}
      className={`${obtenerClasesBoton(variante, anchoCompleto, className)} disabled:cursor-not-allowed disabled:opacity-50`}
      {...resto}
    />
  );
}

/** Enlace con apariencia de botón de la guía visual. */
export function EnlaceBoton({
  variante = "principal",
  anchoCompleto = false,
  className = "",
  ...resto
}: PropsEnlaceBoton): JSX.Element {
  return <a className={obtenerClasesBoton(variante, anchoCompleto, className)} {...resto} />;
}
