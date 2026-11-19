import type { ReactNode } from "react";

import { Boton } from "~/componentes/Boton";
import { Etiqueta } from "~/componentes/Etiqueta";
import { TarjetaProducto } from "~/componentes/TarjetaProducto";

import type { Route } from "./+types/guia-visual";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Guía visual · Clemen Corbacho Patronaje" }, { name: "robots", content: "noindex" }];
}

const colores = [
  { nombre: "Crema", token: "crema", hex: "#FBF7F2", uso: "Fondo general", clase: "bg-crema" },
  { nombre: "Lino", token: "lino", hex: "#F2EADF", uso: "Tarjetas, cabecera y pie", clase: "bg-lino" },
  { nombre: "Hilo", token: "hilo", hex: "#D9CDBE", uso: "Bordes y separadores", clase: "bg-hilo" },
  { nombre: "Tinta", token: "tinta", hex: "#2A2420", uso: "Texto principal", clase: "bg-tinta" },
  {
    nombre: "Tinta suave",
    token: "tinta-suave",
    hex: "#5E544C",
    uso: "Texto secundario",
    clase: "bg-tinta-suave",
  },
  {
    nombre: "Terracota",
    token: "terracota",
    hex: "#A3492A",
    uso: "Acento: botón principal, precio",
    clase: "bg-terracota",
  },
  {
    nombre: "Terracota oscuro",
    token: "terracota-oscuro",
    hex: "#843A21",
    uso: "Hover del acento",
    clase: "bg-terracota-oscuro",
  },
  { nombre: "Salvia", token: "salvia", hex: "#56705E", uso: "Confirmaciones", clase: "bg-salvia" },
  {
    nombre: "Salvia claro",
    token: "salvia-claro",
    hex: "#E3EAE2",
    uso: "Etiquetas y avisos",
    clase: "bg-salvia-claro",
  },
];

// Productos de ejemplo solo para enseñar la tarjeta: no son datos reales del catálogo.
const productosEjemplo = [
  { nombre: "Patrón de ejemplo: vestido", precioDesdeCentimos: 950, tallas: "36 a 48", nivel: "Fácil" },
  { nombre: "Patrón de ejemplo: camisa", precioDesdeCentimos: 1250, tallas: "S a XXL", nivel: "Intermedio" },
];

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="border-t border-hilo py-10">
      <h2 className="mb-6 text-2xl font-semibold">{titulo}</h2>
      {children}
    </section>
  );
}

/**
 * Muestra de la guía visual (EPIC1, US4, T11) para que el PM la apruebe.
 * No está enlazada desde la tienda y lleva noindex.
 */
export default function GuiaVisual() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm font-medium tracking-wide text-terracota uppercase">Aprobada</p>
      <h1 className="mt-2 text-4xl font-semibold">Guía visual</h1>
      <p className="mt-4 max-w-2xl text-lg text-tinta-suave">
        Una imagen cálida de taller de costura: papel crema, lino, tinta y un acento terracota. Pensada
        primero para el móvil, con textos grandes y botones fáciles de pulsar.
      </p>

      <Seccion titulo="Colores">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {colores.map((color) => (
            <li key={color.token} className="overflow-hidden rounded-tarjeta border border-hilo bg-white">
              <div className={`h-16 ${color.clase}`} />
              <div className="p-3">
                <p className="font-semibold">{color.nombre}</p>
                <p className="text-sm text-tinta-suave">{color.hex}</p>
                <p className="mt-1 text-sm">{color.uso}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-tinta-suave">
          Todas las combinaciones de texto cumplen el contraste WCAG AA (mínimo 4,5:1).
        </p>
      </Seccion>

      <Seccion titulo="Tipografía">
        <div className="space-y-4">
          <p className="text-sm text-tinta-suave">Títulos: Fraunces · Texto: DM Sans</p>
          <p className="font-titulos text-4xl font-semibold">Patrones para coser a tu medida</p>
          <p className="font-titulos text-2xl font-semibold">Vestidos y faldas</p>
          <p className="font-titulos text-xl font-semibold">Instrucciones paso a paso</p>
          <p className="max-w-2xl text-base">
            Texto normal a 16 px. Cada patrón incluye las piezas en PDF listas para imprimir en casa, la tabla
            de medidas y las instrucciones de montaje.
          </p>
          <p className="text-sm text-tinta-suave">Texto secundario a 14 px para datos y notas.</p>
        </div>
      </Seccion>

      <Seccion titulo="Botones">
        <div className="flex flex-wrap gap-3">
          <Boton>Añadir al carrito</Boton>
          <Boton variante="secundario">Ver tabla de medidas</Boton>
          <Boton variante="fantasma">Seguir comprando</Boton>
          <Boton disabled>Agotado</Boton>
        </div>
        <div className="mt-4 max-w-sm">
          <Boton anchoCompleto>Pagar con tarjeta</Boton>
        </div>
      </Seccion>

      <Seccion titulo="Etiquetas y campos">
        <div className="flex flex-wrap gap-2">
          <Etiqueta>Fácil</Etiqueta>
          <Etiqueta>Señora</Etiqueta>
          <Etiqueta>Nuevo</Etiqueta>
        </div>
        <label className="mt-6 block max-w-xs">
          <span className="mb-1 block text-sm font-medium">Talla</span>
          <select className="min-h-11 w-full rounded-boton border border-hilo bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-terracota">
            <option>Elige tu talla</option>
            <option>38</option>
            <option>40</option>
            <option>42</option>
          </select>
        </label>
        <label className="mt-4 block max-w-xs">
          <span className="mb-1 block text-sm font-medium">Correo para recibir el patrón</span>
          <input
            type="email"
            placeholder="tucorreo@ejemplo.com"
            className="min-h-11 w-full rounded-boton border border-hilo bg-white px-3 text-base placeholder:text-tinta-suave focus-visible:outline-2 focus-visible:outline-terracota"
          />
        </label>
        <p className="mt-4 max-w-md rounded-boton bg-salvia-claro p-3 text-sm">
          ✓ Pago recibido. Te hemos enviado el patrón y la factura a tu correo.
        </p>
      </Seccion>

      <Seccion titulo="Tarjeta de producto">
        <div className="grid max-w-md grid-cols-2 gap-4">
          {productosEjemplo.map((producto) => (
            <TarjetaProducto key={producto.nombre} {...producto} enlace="#" />
          ))}
        </div>
      </Seccion>
    </main>
  );
}
