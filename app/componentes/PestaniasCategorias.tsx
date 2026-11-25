import type { JSX } from "react";

import type { Categoria } from "~/lib/catalogo.servidor";
import type { ParametrosFiltros } from "~/lib/filtros";
import { construirUrlFiltros } from "~/lib/filtros";

interface PropsElementoPestania {
  nombre: string;
  href: string;
  activa: boolean;
}

function ElementoPestania({ nombre, href, activa }: PropsElementoPestania): JSX.Element {
  const estilosBase =
    "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-boton px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota";
  const estilosEstado = activa
    ? "bg-terracota text-white shadow-xs"
    : "border border-hilo bg-white text-tinta hover:border-terracota hover:bg-lino hover:text-terracota";

  return (
    <a
      href={href}
      className={`${estilosBase} ${estilosEstado}`}
      {...(activa ? { "aria-current": "page" } : {})}
    >
      {nombre}
    </a>
  );
}

export interface PropsPestaniasCategorias {
  categorias: Categoria[];
  filtros: ParametrosFiltros;
}

/** Barra de pestañas por categoría sincronizada con la URL (?categoria=<slug>) (AC 3.1). */
export function PestaniasCategorias({ categorias, filtros }: PropsPestaniasCategorias): JSX.Element {
  const urlTodas = construirUrlFiltros("/patrones", filtros, { categoria: undefined });
  const todasActiva = !filtros.categoria;

  return (
    <nav aria-label="Categorías de patrones" className="flex scrollbar-none gap-2 overflow-x-auto pb-2">
      <ElementoPestania nombre="Todas" href={urlTodas} activa={todasActiva} />
      {categorias.map((cat) => {
        const activa = filtros.categoria === cat.slug;
        const href = construirUrlFiltros("/patrones", filtros, { categoria: cat.slug });
        return <ElementoPestania key={cat.id} nombre={cat.nombre} href={href} activa={activa} />;
      })}
    </nav>
  );
}
