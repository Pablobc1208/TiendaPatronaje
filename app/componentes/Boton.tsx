import type { ButtonHTMLAttributes } from "react";

export type VarianteBoton = "principal" | "secundario" | "fantasma";

const estilosVariante: Record<VarianteBoton, string> = {
  principal: "bg-terracota text-white hover:bg-terracota-oscuro",
  secundario: "border border-tinta bg-transparent text-tinta hover:bg-lino",
  fantasma: "bg-transparent text-terracota underline-offset-4 hover:underline",
};

interface PropsBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  /** Ocupa todo el ancho (útil en móvil, p. ej. "Añadir al carrito"). */
  anchoCompleto?: boolean;
}

/** Botón de la guía visual. Altura mínima de 44 px para pulsarlo bien en el móvil. */
export function Boton({
  variante = "principal",
  anchoCompleto = false,
  className = "",
  type = "button",
  ...resto
}: PropsBoton) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-boton px-5 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota disabled:cursor-not-allowed disabled:opacity-50 ${estilosVariante[variante]} ${anchoCompleto ? "w-full" : ""} ${className}`}
      {...resto}
    />
  );
}
