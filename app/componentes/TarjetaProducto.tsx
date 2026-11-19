import { formatearPrecio } from "~/lib/precios";

import { Etiqueta } from "./Etiqueta";

export interface PropsTarjetaProducto {
  nombre: string;
  /** Precio más bajo entre sus tallas, en céntimos e IVA incluido. */
  precioDesdeCentimos: number;
  /** Texto de tallas, p. ej. "36 a 48". */
  tallas: string;
  nivel?: string;
  /** URL de la foto; si falta se muestra un hueco con el aviso "Foto pendiente". */
  imagen?: string;
  enlace: string;
}

/** Tarjeta de producto para el listado del catálogo (EPIC2). Primero móvil: 2 por fila. */
export function TarjetaProducto({
  nombre,
  precioDesdeCentimos,
  tallas,
  nivel,
  imagen,
  enlace,
}: PropsTarjetaProducto) {
  return (
    <a
      href={enlace}
      className="group block overflow-hidden rounded-tarjeta border border-hilo bg-white transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
    >
      <div className="aspect-[3/4] bg-lino">
        {imagen ? (
          <img src={imagen} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-tinta-suave">
            Foto pendiente
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        {nivel && <Etiqueta>{nivel}</Etiqueta>}
        <h3 className="text-base leading-snug font-semibold group-hover:text-terracota">{nombre}</h3>
        <p className="text-sm text-tinta-suave">Tallas {tallas}</p>
        <p className="text-base">
          <span className="text-tinta-suave">desde </span>
          <span className="font-bold text-terracota">{formatearPrecio(precioDesdeCentimos)}</span>
          <span className="text-xs text-tinta-suave"> IVA incl.</span>
        </p>
      </div>
    </a>
  );
}
