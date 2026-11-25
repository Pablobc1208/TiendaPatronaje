import type { JSX } from "react";

import type { ParametrosFiltros } from "~/lib/filtros";
import { construirUrlFiltros } from "~/lib/filtros";

interface PropsChipTalla {
  talla: string;
  activa: boolean;
  href: string;
}

function ChipTalla({ talla, activa, href }: PropsChipTalla): JSX.Element {
  const estilosBase =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-tarjeta px-3 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota";
  const estilosEstado = activa
    ? "border border-terracota bg-terracota text-white shadow-xs"
    : "border border-hilo bg-white text-tinta hover:border-terracota hover:bg-lino hover:text-terracota";

  return (
    <a
      href={href}
      className={`${estilosBase} ${estilosEstado}`}
      {...(activa ? { "aria-current": "true" } : {})}
    >
      {talla}
    </a>
  );
}

export interface PropsChipsFiltro {
  tallas: string[];
  filtros: ParametrosFiltros;
}

/** Chips de tallas para filtrar el catálogo (?talla=<talla>) (AC 3.2). */
export function ChipsFiltro({ tallas, filtros }: PropsChipsFiltro): JSX.Element | null {
  if (!tallas || tallas.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold tracking-wider text-tinta-suave uppercase">
        Filtrar por talla:
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por talla">
        {tallas.map((talla) => {
          const activa = filtros.talla === talla;
          const href = construirUrlFiltros("/patrones", filtros, {
            talla: activa ? undefined : talla,
          });
          return <ChipTalla key={talla} talla={talla} activa={activa} href={href} />;
        })}
      </div>
    </div>
  );
}
