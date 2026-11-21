import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Categoria, PatronConRelaciones } from "~/lib/catalogo.servidor";
import * as catalogoServidor from "~/lib/catalogo.servidor";
import * as supabaseServidor from "~/lib/supabase.servidor";

import Inicio, { formatearResumenTallas, loader, meta } from "./inicio";

const categoriasMock: Categoria[] = [
  { id: "1", nombre: "Flamenca", slug: "flamenca", creada_en: "2026-11-20" },
  { id: "2", nombre: "Señora", slug: "senora", creada_en: "2026-11-20" },
  { id: "3", nombre: "Caballero", slug: "caballero", creada_en: "2026-11-20" },
  { id: "4", nombre: "Complementos", slug: "complementos", creada_en: "2026-11-20" },
  { id: "5", nombre: "Patrones base", slug: "patrones-base", creada_en: "2026-11-20" },
];

const novedadesMock: PatronConRelaciones[] = [
  {
    id: "p-1",
    categoria_id: "1",
    nombre: "Vestido flamenca de nejas",
    slug: "vestido-flamenca-nejas",
    descripcion: "Descripción",
    tela_recomendada: null,
    metraje: null,
    nivel: null,
    margen_costura: false,
    activo: true,
    creado_en: "2026-11-20T12:00:00Z",
    categoria: categoriasMock[0]!,
    variantes: [
      {
        id: "v-1",
        producto_id: "p-1",
        talla: "42",
        precio_centimos: 1250,
        hojas_a4: null,
        medidas: null,
        creada_en: "2026-11-20",
      },
      {
        id: "v-2",
        producto_id: "p-1",
        talla: "48 curvy",
        precio_centimos: 1250,
        hojas_a4: 38,
        medidas: null,
        creada_en: "2026-11-20",
      },
    ],
    precio_desde_centimos: 1250,
  },
  {
    id: "p-2",
    categoria_id: "2",
    nombre: "Falda evasé",
    slug: "falda-evase",
    descripcion: "Descripción falda",
    tela_recomendada: null,
    metraje: null,
    nivel: null,
    margen_costura: null,
    activo: true,
    creado_en: "2026-11-20T11:00:00Z",
    categoria: categoriasMock[1]!,
    variantes: [
      {
        id: "v-3",
        producto_id: "p-2",
        talla: "38",
        precio_centimos: 540,
        hojas_a4: null,
        medidas: null,
        creada_en: "2026-11-20",
      },
    ],
    precio_desde_centimos: 540,
  },
  {
    id: "p-3",
    categoria_id: "3",
    nombre: "Camisa de caballero",
    slug: "camisa-caballero",
    descripcion: "Descripción camisa",
    tela_recomendada: null,
    metraje: null,
    nivel: null,
    margen_costura: true,
    activo: true,
    creado_en: "2026-11-20T10:00:00Z",
    categoria: categoriasMock[2]!,
    variantes: [
      {
        id: "v-4",
        producto_id: "p-3",
        talla: "S",
        precio_centimos: 1090,
        hojas_a4: null,
        medidas: null,
        creada_en: "2026-11-20",
      },
    ],
    precio_desde_centimos: 1090,
  },
  {
    id: "p-4",
    categoria_id: "4",
    nombre: "Bolso Macu",
    slug: "bolso-macu",
    descripcion: "Descripción bolso",
    tela_recomendada: null,
    metraje: null,
    nivel: null,
    margen_costura: null,
    activo: true,
    creado_en: "2026-11-20T09:00:00Z",
    categoria: categoriasMock[3]!,
    variantes: [
      {
        id: "v-5",
        producto_id: "p-4",
        talla: "Medida única",
        precio_centimos: 280,
        hojas_a4: null,
        medidas: null,
        creada_en: "2026-11-20",
      },
    ],
    precio_desde_centimos: 280,
  },
];

describe("Inicio (T5 - AC2.1, AC2.2)", () => {
  it("exporta metadatos con la descripción requerida", () => {
    const descriptores = meta({} as Parameters<typeof meta>[0]);
    expect(descriptores).toEqual([
      { title: "Clemen Corbacho Patronaje" },
      {
        name: "description",
        content: "Patrones de costura en PDF de Clemen Corbacho, claros, bien explicados y fáciles de usar.",
      },
    ]);
  });

  it("muestra el hero con el texto biográfico real de Clemen y sin imágenes de stock (AC 2.1)", () => {
    const { container } = render(<Inicio loaderData={{ categorias: categoriasMock, novedades: [] }} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Clemen Corbacho Patronaje");
    expect(
      screen.getByText(/Clemen Corbacho cose de forma profesional desde los 12 años/i),
    ).toBeInTheDocument();

    const imagenes = container.querySelectorAll("img");
    expect(imagenes).toHaveLength(0);
  });

  it("muestra accesos directos a las 5 categorías que enlazan a /patrones?categoria=<slug> (AC 2.2)", () => {
    render(<Inicio loaderData={{ categorias: categoriasMock, novedades: [] }} />);

    expect(screen.getByRole("heading", { level: 2, name: /categorías/i })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Flamenca" })).toHaveAttribute(
      "href",
      "/patrones?categoria=flamenca",
    );
    expect(screen.getByRole("link", { name: "Señora" })).toHaveAttribute(
      "href",
      "/patrones?categoria=senora",
    );
    expect(screen.getByRole("link", { name: "Caballero" })).toHaveAttribute(
      "href",
      "/patrones?categoria=caballero",
    );
    expect(screen.getByRole("link", { name: "Complementos" })).toHaveAttribute(
      "href",
      "/patrones?categoria=complementos",
    );
    expect(screen.getByRole("link", { name: "Patrones base" })).toHaveAttribute(
      "href",
      "/patrones?categoria=patrones-base",
    );
  });
});

describe("Inicio (T6 - AC2.3: Novedades y Loader)", () => {
  it("formatearResumenTallas sintetiza las variantes adecuadamente", () => {
    expect(formatearResumenTallas([])).toBe("Consultar");
    expect(formatearResumenTallas([{ talla: "Medida única" }])).toBe("Medida única");
    expect(formatearResumenTallas([{ talla: "38" }, { talla: "40" }, { talla: "42" }])).toBe("38 a 42");
    expect(formatearResumenTallas([{ talla: "42" }, { talla: "48 curvy" }])).toBe("42, 48 curvy");
  });

  it("muestra la sección de Novedades con los últimos 4 patrones usando TarjetaProducto (AC 2.3)", () => {
    render(<Inicio loaderData={{ categorias: categoriasMock, novedades: novedadesMock }} />);

    expect(screen.getByRole("heading", { level: 2, name: /novedades/i })).toBeInTheDocument();

    // Comprueba las 4 tarjetas y sus precios desde
    expect(screen.getByText("Vestido flamenca de nejas")).toBeInTheDocument();
    expect(screen.getByText("12,50 €")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /vestido flamenca de nejas/i })).toHaveAttribute(
      "href",
      "/patrones/vestido-flamenca-nejas",
    );

    expect(screen.getByText("Falda evasé")).toBeInTheDocument();
    expect(screen.getByText("5,40 €")).toBeInTheDocument();

    expect(screen.getByText("Camisa de caballero")).toBeInTheDocument();
    expect(screen.getByText("10,90 €")).toBeInTheDocument();

    expect(screen.getByText("Bolso Macu")).toBeInTheDocument();
    expect(screen.getByText("2,80 €")).toBeInTheDocument();

    // Comprueba el marcador "Foto pendiente" en las tarjetas sin imagen
    const fotosPendientes = screen.getAllByText("Foto pendiente");
    expect(fotosPendientes).toHaveLength(4);
  });

  it("el loader consulta las categorías y los 4 patrones de novedades usando catalogo.servidor", async () => {
    vi.spyOn(supabaseServidor, "crearClienteSupabaseServidor").mockReturnValue({
      supabase: {} as unknown as supabaseServidor.ClienteSupabaseServidor["supabase"],
      cabeceras: new Headers(),
    });
    vi.spyOn(catalogoServidor, "obtenerCategorias").mockResolvedValue(categoriasMock);
    vi.spyOn(catalogoServidor, "obtenerNovedades").mockResolvedValue(novedadesMock);

    const contextoFalso = {
      get: vi.fn().mockReturnValue({ env: {} }),
    };

    const respuesta = await loader({
      request: new Request("https://tiendapatronaje.es/"),
      context: contextoFalso,
      params: {},
    } as unknown as Parameters<typeof loader>[0]);

    expect(catalogoServidor.obtenerCategorias).toHaveBeenCalled();
    expect(catalogoServidor.obtenerNovedades).toHaveBeenCalledWith(expect.anything(), 4);

    const datosRespuesta = respuesta.data as {
      categorias: Categoria[];
      novedades: PatronConRelaciones[];
    };
    expect(datosRespuesta.categorias).toEqual(categoriasMock);
    expect(datosRespuesta.novedades).toEqual(novedadesMock);
  });
});
