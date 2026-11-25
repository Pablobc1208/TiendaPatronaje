import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Categoria, PatronConRelaciones } from "~/lib/catalogo.servidor";
import * as catalogoServidor from "~/lib/catalogo.servidor";
import * as supabaseServidor from "~/lib/supabase.servidor";

import CatalogoPatrones, { loader, meta } from "./patrones._index";

const categoriasMock: Categoria[] = [
  { id: "1", nombre: "Flamenca", slug: "flamenca", creada_en: "2026-11-20" },
  { id: "2", nombre: "Señora", slug: "senora", creada_en: "2026-11-20" },
];

const patronesMock: PatronConRelaciones[] = [
  {
    id: "p-1",
    categoria_id: "1",
    nombre: "Vestido flamenca de nejas",
    slug: "vestido-flamenca-nejas",
    descripcion: "Descripción",
    tela_recomendada: null,
    metraje: null,
    nivel: "Intermedio",
    margen_costura: true,
    activo: true,
    creado_en: "2026-11-20T12:00:00Z",
    categoria: categoriasMock[0]!,
    variantes: [
      {
        id: "v-1",
        producto_id: "p-1",
        talla: "42",
        precio_centimos: 1250,
        hojas_a4: 38,
        medidas: null,
        creada_en: "2026-11-20",
      },
    ],
    precio_desde_centimos: 1250,
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Catálogo (T8 - AC 3.1: Configuración de ruta y loader básico)", () => {
  it("exporta metadatos con el título del catálogo", () => {
    const descriptores = meta({} as Parameters<typeof meta>[0]);
    expect(descriptores).toEqual([
      { title: "Catálogo de patrones | Clemen Corbacho Patronaje" },
      {
        name: "description",
        content: "Explora la colección completa de patrones de costura en PDF de Clemen Corbacho.",
      },
    ]);
  });

  it("el loader obtiene patrones, categorías y tallas disponibles aplicando filtros de URL", async () => {
    vi.spyOn(supabaseServidor, "crearClienteSupabaseServidor").mockReturnValue({
      supabase: {} as unknown as supabaseServidor.ClienteSupabaseServidor["supabase"],
      cabeceras: new Headers(),
    });
    vi.spyOn(catalogoServidor, "obtenerPatrones").mockResolvedValue(patronesMock);
    vi.spyOn(catalogoServidor, "obtenerCategorias").mockResolvedValue(categoriasMock);
    vi.spyOn(catalogoServidor, "obtenerTallasDisponibles").mockResolvedValue(["38", "42"]);

    const contextoFalso = {
      get: vi.fn().mockReturnValue({ env: {} }),
    };

    const respuesta = await loader({
      request: new Request("https://tiendapatronaje.es/patrones?categoria=flamenca"),
      context: contextoFalso,
      params: {},
    } as unknown as Parameters<typeof loader>[0]);

    expect(catalogoServidor.obtenerPatrones).toHaveBeenCalledWith(expect.anything(), {
      categoriaSlug: "flamenca",
      talla: undefined,
      orden: undefined,
      busqueda: undefined,
    });
    expect(catalogoServidor.obtenerCategorias).toHaveBeenCalled();
    expect(catalogoServidor.obtenerTallasDisponibles).toHaveBeenCalled();

    expect(respuesta.data.patrones).toEqual(patronesMock);
    expect(respuesta.data.filtros.categoria).toBe("flamenca");
  });

  it("el loader propaga los parámetros de talla y ordenación (AC 3.2, AC 3.3)", async () => {
    vi.spyOn(supabaseServidor, "crearClienteSupabaseServidor").mockReturnValue({
      supabase: {} as unknown as supabaseServidor.ClienteSupabaseServidor["supabase"],
      cabeceras: new Headers(),
    });
    vi.spyOn(catalogoServidor, "obtenerPatrones").mockResolvedValue(patronesMock);
    vi.spyOn(catalogoServidor, "obtenerCategorias").mockResolvedValue(categoriasMock);
    vi.spyOn(catalogoServidor, "obtenerTallasDisponibles").mockResolvedValue(["38", "42"]);

    const contextoFalso = {
      get: vi.fn().mockReturnValue({ env: {} }),
    };

    const respuesta = await loader({
      request: new Request(
        "https://tiendapatronaje.es/patrones?categoria=flamenca&talla=42&orden=precio-asc",
      ),
      context: contextoFalso,
      params: {},
    } as unknown as Parameters<typeof loader>[0]);

    expect(catalogoServidor.obtenerPatrones).toHaveBeenCalledWith(expect.anything(), {
      categoriaSlug: "flamenca",
      talla: "42",
      orden: "precio-asc",
      busqueda: undefined,
    });

    expect(respuesta.data.filtros.talla).toBe("42");
    expect(respuesta.data.filtros.orden).toBe("precio-asc");
  });

  it("renderiza el encabezado del catálogo, pestañas, chips, ordenación y tarjetas de patrones", () => {
    render(
      <CatalogoPatrones
        loaderData={{
          patrones: patronesMock,
          categorias: categoriasMock,
          tallasDisponibles: ["42"],
          filtros: {},
        }}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: /catálogo de patrones/i })).toBeInTheDocument();
    expect(
      screen.getByText("Patrones de costura en PDF, claros, bien explicados y fáciles de usar."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Todas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Flamenca" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "42" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /ordenar por/i })).toBeInTheDocument();
    expect(screen.getByText("Vestido flamenca de nejas")).toBeInTheDocument();
    expect(screen.getByText("12,50 €")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /vestido flamenca de nejas/i })).toHaveAttribute(
      "href",
      "/patrones/vestido-flamenca-nejas",
    );
  });

  it("muestra el mensaje de estado sin resultados y botón 'Quitar filtros' cuando la lista está vacía (AC 3.4)", () => {
    render(
      <CatalogoPatrones
        loaderData={{
          patrones: [],
          categorias: categoriasMock,
          tallasDisponibles: ["42"],
          filtros: { categoria: "flamenca", talla: "36" },
        }}
      />,
    );

    expect(
      screen.getByText("No encontramos ningún patrón con los filtros seleccionados."),
    ).toBeInTheDocument();
    const enlaceQuitarFiltros = screen.getByRole("link", { name: /quitar filtros/i });
    expect(enlaceQuitarFiltros).toBeInTheDocument();
    expect(enlaceQuitarFiltros).toHaveAttribute("href", "/patrones");
  });
});
