import type { JSX, ReactNode } from "react";

/** Etiqueta pequeña para datos del patrón: nivel, categoría, "Nuevo"… */
export function Etiqueta({ children }: { children: ReactNode }): JSX.Element {
  return (
    <span className="inline-flex items-center rounded-full bg-salvia-claro px-2.5 py-0.5 text-sm font-medium text-tinta">
      {children}
    </span>
  );
}
