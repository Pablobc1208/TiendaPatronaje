import { describe, expect, it, vi } from "vitest";

import type { ClienteSupabaseServidor } from "./supabase.servidor";
import {
  obtenerCategorias,
  obtenerNovedades,
  obtenerPatronPorSlug,
  obtenerPatrones,
  obtenerPatronesRelacionados,
  obtenerTallasDisponibles,
  type Categoria,
  type VarianteProducto,
} from "./catalogo.servidor";

// ============================================================================
// Datos simulados para los tests
// ============================================================================

const categoriaFlamenca: Categoria = {
  id: "cat-1",
  nombre: "Flamenca",
  slug: "flamenca",
  creada_en: "2026-11-20T10:00:00Z",
};

const categoriaSenora: Categoria = {
  id: "cat-2",
  nombre: "Señora",
  slug: "senora",
  creada_en: "2026-11-20T10:00:00Z",
};

const variantesVestido: VarianteProducto[] = [
  {
    id: "var-1",
    producto_id: "prod-1",
    talla: "42",
    precio_centimos: 1250,
    hojas_a4: null,
    medidas: { largo_desde_cintura: 105 },
    creada_en: "2026-11-20T10:00:00Z",
  },
  {
    id: "var-2",
    producto_id: "prod-1",
    talla: "48 curvy",
    precio_centimos: 1250,
    hojas_a4: 38,
    medidas: null,
    creada_en: "2026-11-20T10:00:00Z",
  },
];

const variantesFalda: VarianteProducto[] = [
  {
    id: "var-3",
    producto_id: "prod-2",
    talla: "38",
    precio_centimos: 540,
    hojas_a4: null,
    medidas: null,
    creada_en: "2026-11-20T10:00:00Z",
  },
  {
    id: "var-4",
    producto_id: "prod-2",
    talla: "44",
    precio_centimos: 540,
    hojas_a4: null,
    medidas: { cintura: 84 },
    creada_en: "2026-11-20T10:00:00Z",
  },
];

const productoActivo1 = {
  id: "prod-1",
  categoria_id: "cat-1",
  nombre: "Vestido flamenca de nejas",
  slug: "vestido-flamenca-nejas",
  descripcion: "Vestido de nejas ideal para flamenca",
  tela_recomendada: null,
  metraje: null,
  nivel: null,
  margen_costura: false,
  activo: true,
  creado_en: "2026-11-20T12:00:00Z",
  categoria: categoriaFlamenca,
  variantes: variantesVestido,
};

const productoActivo2 = {
  id: "prod-2",
  categoria_id: "cat-2",
  nombre: "Falda evasé",
  slug: "falda-evase",
  descripcion: "Falda sencilla con vuelo natural",
  tela_recomendada: "Tejido con caída",
  metraje: null,
  nivel: null,
  margen_costura: null,
  activo: true,
  creado_en: "2026-11-20T11:00:00Z",
  categoria: categoriaSenora,
  variantes: variantesFalda,
};

/**
 * Crea un cliente Supabase simulado con encadenamiento fluido para pruebas unitarias.
 */
function crearClienteSupabaseSimulado(opciones: {
  datos?: unknown;
  error?: unknown;
  alFiltrar?: (campo: string, valor: unknown) => void;
  alOrdenar?: (campo: string, ascendente?: boolean) => void;
  alLimitar?: (limite: number) => void;
  alLlamarRpc?: (nombre: string, args: unknown) => void;
}) {
  const constructorConsulta: Record<string, unknown> = {};

  const promesaResultado = Promise.resolve({
    data: opciones.datos ?? null,
    error: opciones.error ?? null,
  });

  const metodosEncadenables = {
    select: vi.fn().mockImplementation(() => metodosEncadenables),
    eq: vi.fn().mockImplementation((campo: string, valor: unknown) => {
      opciones.alFiltrar?.(campo, valor);
      return metodosEncadenables;
    }),
    neq: vi.fn().mockImplementation((campo: string, valor: unknown) => {
      opciones.alFiltrar?.(`neq:${campo}`, valor);
      return metodosEncadenables;
    }),
    order: vi.fn().mockImplementation((campo: string, config?: { ascending?: boolean }) => {
      opciones.alOrdenar?.(campo, config?.ascending);
      return metodosEncadenables;
    }),
    limit: vi.fn().mockImplementation((limite: number) => {
      opciones.alLimitar?.(limite);
      return metodosEncadenables;
    }),
    maybeSingle: vi.fn().mockImplementation(() =>
      Promise.resolve({
        data: Array.isArray(opciones.datos) ? (opciones.datos[0] ?? null) : (opciones.datos ?? null),
        error: opciones.error ?? null,
      }),
    ),
    then: promesaResultado.then.bind(promesaResultado),
  };

  Object.assign(constructorConsulta, metodosEncadenables);

  const cliente = {
    from: vi.fn().mockReturnValue(constructorConsulta),
    rpc: vi.fn().mockImplementation((nombre: string, args: unknown) => {
      opciones.alLlamarRpc?.(nombre, args);
      return metodosEncadenables;
    }),
  };

  return { cliente, constructorConsulta };
}

// ============================================================================
// Pruebas unitarias
// ============================================================================

describe("catalogo.servidor", () => {
  describe("obtenerCategorias", () => {
    it("consulta la tabla categorias ordenada por nombre", async () => {
      const categoriasEsperadas = [categoriaFlamenca, categoriaSenora];
      const { cliente } = crearClienteSupabaseSimulado({ datos: categoriasEsperadas });

      const resultado = await obtenerCategorias(cliente as unknown as ClienteSupabaseServidor["supabase"]);

      expect(cliente.from).toHaveBeenCalledWith("categorias");
      expect(resultado).toEqual(categoriasEsperadas);
    });
  });

  describe("obtenerNovedades (AC 1.4, AC 2.3)", () => {
    it("exige activo = true y ordena por creado_en descendente con límite 4 por defecto", async () => {
      const filtrosAplicados: Record<string, unknown> = {};
      let ordenadoPor = "";
      let ascendente = true;
      let limiteAplicado = 0;

      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1, productoActivo2],
        alFiltrar: (campo, valor) => {
          filtrosAplicados[campo] = valor;
        },
        alOrdenar: (campo, asc) => {
          ordenadoPor = campo;
          ascendente = Boolean(asc);
        },
        alLimitar: (lim) => {
          limiteAplicado = lim;
        },
      });

      const resultado = await obtenerNovedades(cliente as unknown as ClienteSupabaseServidor["supabase"]);

      expect(cliente.from).toHaveBeenCalledWith("productos");
      expect(filtrosAplicados["activo"]).toBe(true);
      expect(ordenadoPor).toBe("creado_en");
      expect(ascendente).toBe(false);
      expect(limiteAplicado).toBe(4);

      // Comprueba el cálculo del precio mínimo "desde"
      expect(resultado[0]!.precio_desde_centimos).toBe(1250);
      expect(resultado[1]!.precio_desde_centimos).toBe(540);
    });

    it("funciona recibiendo también el objeto devuelto por crearClienteSupabaseServidor", async () => {
      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1],
      });
      const contextoServidor = {
        supabase: cliente as unknown as ClienteSupabaseServidor["supabase"],
        cabeceras: new Headers(),
      };

      const resultado = await obtenerNovedades(contextoServidor);
      expect(resultado).toHaveLength(1);
      expect(resultado[0]!.nombre).toBe("Vestido flamenca de nejas");
    });
  });

  describe("obtenerPatrones (AC 1.4, AC 3.1, AC 3.2, AC 3.3, AC 4.1)", () => {
    it("excluye productos inactivos al consultar la lista general", async () => {
      const filtrosAplicados: Record<string, unknown> = {};
      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1, productoActivo2],
        alFiltrar: (campo, valor) => {
          filtrosAplicados[campo] = valor;
        },
      });

      const resultado = await obtenerPatrones(cliente as unknown as ClienteSupabaseServidor["supabase"]);

      expect(cliente.from).toHaveBeenCalledWith("productos");
      expect(filtrosAplicados["activo"]).toBe(true);
      expect(resultado).toHaveLength(2);
    });

    it("filtra por slug de categoría cuando se indica", async () => {
      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1, productoActivo2],
      });

      const resultado = await obtenerPatrones(cliente as unknown as ClienteSupabaseServidor["supabase"], {
        categoriaSlug: "flamenca",
      });

      expect(resultado).toHaveLength(1);
      expect(resultado[0]!.slug).toBe("vestido-flamenca-nejas");
    });

    it("filtra por talla disponible en las variantes del patrón", async () => {
      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1, productoActivo2],
      });

      const resultado = await obtenerPatrones(cliente as unknown as ClienteSupabaseServidor["supabase"], {
        talla: "38",
      });

      expect(resultado).toHaveLength(1);
      expect(resultado[0]!.slug).toBe("falda-evase");
    });

    it("ordena por precio ascendente y descendente", async () => {
      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1, productoActivo2],
      });

      const menorAMayor = await obtenerPatrones(cliente as unknown as ClienteSupabaseServidor["supabase"], {
        orden: "precio-asc",
      });
      expect(menorAMayor[0]!.slug).toBe("falda-evase");
      expect(menorAMayor[1]!.slug).toBe("vestido-flamenca-nejas");

      const mayorAMenor = await obtenerPatrones(cliente as unknown as ClienteSupabaseServidor["supabase"], {
        orden: "precio-desc",
      });
      expect(mayorAMenor[0]!.slug).toBe("vestido-flamenca-nejas");
      expect(mayorAMenor[1]!.slug).toBe("falda-evase");
    });

    it("utiliza la RPC buscar_patrones cuando se indica un término de búsqueda", async () => {
      let rpcLlamada = "";
      let rpcArgs: unknown = null;

      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1],
        alLlamarRpc: (nombre, args) => {
          rpcLlamada = nombre;
          rpcArgs = args;
        },
      });

      const resultado = await obtenerPatrones(cliente as unknown as ClienteSupabaseServidor["supabase"], {
        busqueda: "flamenca",
      });

      expect(rpcLlamada).toBe("buscar_patrones");
      expect(rpcArgs).toEqual({ termino: "flamenca" });
      expect(resultado).toHaveLength(1);
    });
  });

  describe("obtenerPatronPorSlug (AC 1.4, AC 5.1, AC 5.2)", () => {
    it("exige activo = true y el slug exacto", async () => {
      const filtrosAplicados: Record<string, unknown> = {};
      const { cliente } = crearClienteSupabaseSimulado({
        datos: productoActivo1,
        alFiltrar: (campo, valor) => {
          filtrosAplicados[campo] = valor;
        },
      });

      const resultado = await obtenerPatronPorSlug(
        cliente as unknown as ClienteSupabaseServidor["supabase"],
        "vestido-flamenca-nejas",
      );

      expect(filtrosAplicados["activo"]).toBe(true);
      expect(filtrosAplicados["slug"]).toBe("vestido-flamenca-nejas");
      expect(resultado).not.toBeNull();
      expect(resultado?.nombre).toBe("Vestido flamenca de nejas");
      expect(resultado?.precio_desde_centimos).toBe(1250);
    });

    it("devuelve null cuando el producto no existe o está inactivo", async () => {
      const { cliente } = crearClienteSupabaseSimulado({
        datos: null,
      });

      const resultado = await obtenerPatronPorSlug(
        cliente as unknown as ClienteSupabaseServidor["supabase"],
        "inactivo-o-inexistente",
      );

      expect(resultado).toBeNull();
    });
  });

  describe("obtenerPatronesRelacionados (AC 1.4, AC 5.6)", () => {
    it("exige activo = true, misma categoría y excluye el producto actual", async () => {
      const filtrosAplicados: Record<string, unknown> = {};
      const { cliente } = crearClienteSupabaseSimulado({
        datos: [productoActivo1],
        alFiltrar: (campo, valor) => {
          filtrosAplicados[campo] = valor;
        },
      });

      const resultado = await obtenerPatronesRelacionados(
        cliente as unknown as ClienteSupabaseServidor["supabase"],
        "cat-1",
        "prod-actual",
        4,
      );

      expect(filtrosAplicados["activo"]).toBe(true);
      expect(filtrosAplicados["categoria_id"]).toBe("cat-1");
      expect(filtrosAplicados["neq:id"]).toBe("prod-actual");
      expect(resultado).toHaveLength(1);
    });
  });

  describe("obtenerTallasDisponibles (AC 1.4, AC 3.2)", () => {
    it("obtiene tallas únicas ordenadas (numéricas, curvy, letras) y excluye 'Medida única' y 'Talla única'", async () => {
      const filasVariantes = [
        { talla: "42", producto: { activo: true } },
        { talla: "38", producto: { activo: true } },
        { talla: "Medida única", producto: { activo: true } },
        { talla: "Talla única", producto: { activo: true } },
        { talla: "48 curvy", producto: { activo: true } },
        { talla: "38", producto: { activo: true } },
        { talla: "M", producto: { activo: true } },
        { talla: "XS", producto: { activo: true } },
      ];

      const { cliente } = crearClienteSupabaseSimulado({
        datos: filasVariantes,
      });

      const tallas = await obtenerTallasDisponibles(
        cliente as unknown as ClienteSupabaseServidor["supabase"],
      );

      expect(cliente.from).toHaveBeenCalledWith("variantes_producto");
      expect(tallas).toEqual(["38", "42", "48 curvy", "XS", "M"]);
    });
  });
});
