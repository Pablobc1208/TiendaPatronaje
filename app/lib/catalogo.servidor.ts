import type { ClienteSupabaseServidor } from "./supabase.servidor";

// ============================================================================
// Tipos del dominio (en español)
// ============================================================================

/** Representa una categoría del catálogo. */
export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  creada_en: string;
}

/** Medidas técnicas registradas en una variante (en cm). */
export type MedidasVariante = Record<string, unknown>;

/** Representa una variante de talla de un patrón. */
export interface VarianteProducto {
  id: string;
  producto_id: string;
  talla: string;
  precio_centimos: number;
  hojas_a4: number | null;
  medidas: MedidasVariante | null;
  creada_en: string;
}

/** Niveles de dificultad admitidos por la restricción de base de datos. */
export type NivelDificultad = "Fácil" | "Intermedio" | "Avanzado";

/** Representa la fila base de la tabla productos en Supabase. */
export interface Producto {
  id: string;
  categoria_id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  tela_recomendada: string | null;
  metraje: string | null;
  nivel: NivelDificultad | null;
  margen_costura: boolean | null;
  activo: boolean;
  creado_en: string;
}

/** Patrón con su categoría asociada, variantes de talla y precio mínimo calculado. */
export interface PatronConRelaciones extends Producto {
  categoria: Categoria;
  variantes: VarianteProducto[];
  precio_desde_centimos: number;
}

/** Opciones de filtrado y ordenación para el catálogo. */
export interface FiltrosCatalogo {
  categoriaSlug?: string;
  talla?: string;
  orden?: "novedad" | "precio-asc" | "precio-desc";
  busqueda?: string;
}

/** Tipo para aceptar tanto el cliente de Supabase como el objeto retornado por crearClienteSupabaseServidor. */
export type ClienteSupabase = ClienteSupabaseServidor["supabase"];
export type EntradaClienteSupabase = ClienteSupabase | ClienteSupabaseServidor;

function resolverCliente(cliente: EntradaClienteSupabase): ClienteSupabase {
  return "supabase" in cliente ? cliente.supabase : cliente;
}

/**
 * Calcula el precio mínimo entre las variantes de un patrón.
 * Devuelve 0 si el patrón no tuviera variantes registradas.
 */
export function calcularPrecioDesde(variantes: VarianteProducto[]): number {
  if (!variantes || variantes.length === 0) return 0;
  return Math.min(...variantes.map((v) => v.precio_centimos));
}

/**
 * Enriquece un producto de la base de datos calculando su precio mínimo desde.
 */
function enriquecerPatron(
  producto: Producto & { categoria: Categoria; variantes: VarianteProducto[] },
): PatronConRelaciones {
  return {
    ...producto,
    precio_desde_centimos: calcularPrecioDesde(producto.variantes ?? []),
  };
}

// ============================================================================
// Consultas al catálogo
// ============================================================================

/**
 * Obtiene todas las categorías oficiales ordenadas alfabéticamente por nombre.
 */
export async function obtenerCategorias(cliente: EntradaClienteSupabase): Promise<Categoria[]> {
  const supabase = resolverCliente(cliente);
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, slug, creada_en")
    .order("nombre");

  if (error) {
    throw new Error(`Error al consultar categorías: ${error.message}`);
  }

  return (data as Categoria[]) ?? [];
}

/**
 * Obtiene los últimos patrones activos ordenados por fecha de creación (AC 2.3).
 */
export async function obtenerNovedades(
  cliente: EntradaClienteSupabase,
  limite: number = 4,
): Promise<PatronConRelaciones[]> {
  const supabase = resolverCliente(cliente);
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*), variantes:variantes_producto(*)")
    .eq("activo", true)
    .order("creado_en", { ascending: false })
    .limit(limite);

  if (error) {
    throw new Error(`Error al consultar novedades: ${error.message}`);
  }

  const filas = (data ?? []) as (Producto & { categoria: Categoria; variantes: VarianteProducto[] })[];
  return filas.map(enriquecerPatron);
}

/**
 * Consulta el catálogo de patrones activos aplicando filtros de categoría, talla, búsqueda y ordenación.
 */
export async function obtenerPatrones(
  cliente: EntradaClienteSupabase,
  filtros: FiltrosCatalogo = {},
): Promise<PatronConRelaciones[]> {
  const supabase = resolverCliente(cliente);

  let consulta;

  if (filtros.busqueda && filtros.busqueda.trim() !== "") {
    // Búsqueda con unaccent mediante la función RPC buscar_patrones
    consulta = supabase
      .rpc("buscar_patrones", { termino: filtros.busqueda.trim() })
      .select("*, categoria:categorias(*), variantes:variantes_producto(*)");
  } else {
    // Consulta directa a la tabla productos exigiendo activo = true
    consulta = supabase
      .from("productos")
      .select("*, categoria:categorias(*), variantes:variantes_producto(*)")
      .eq("activo", true);
  }

  const { data, error } = await consulta;

  if (error) {
    throw new Error(`Error al consultar patrones: ${error.message}`);
  }

  let filas = (data ?? []) as (Producto & { categoria: Categoria; variantes: VarianteProducto[] })[];

  // Garantizar que solo se incluyan patrones activos
  filas = filas.filter((p) => p.activo === true);

  // Filtrado por slug de categoría en memoria (para admitir tanto RPC como consulta directa)
  if (filtros.categoriaSlug && filtros.categoriaSlug.trim() !== "") {
    const slugFiltro = filtros.categoriaSlug.trim().toLowerCase();
    filas = filas.filter((p) => p.categoria?.slug?.toLowerCase() === slugFiltro);
  }

  // Filtrado por talla en las variantes del patrón
  if (filtros.talla && filtros.talla.trim() !== "") {
    const tallaFiltro = filtros.talla.trim().toLowerCase();
    filas = filas.filter((p) => p.variantes?.some((v) => v.talla.toLowerCase() === tallaFiltro));
  }

  const resultado = filas.map(enriquecerPatron);

  // Ordenación
  const orden = filtros.orden ?? "novedad";
  if (orden === "precio-asc") {
    resultado.sort((a, b) => a.precio_desde_centimos - b.precio_desde_centimos);
  } else if (orden === "precio-desc") {
    resultado.sort((a, b) => b.precio_desde_centimos - a.precio_desde_centimos);
  } else {
    // Por defecto: Novedad (creado_en descendente)
    resultado.sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime());
  }

  return resultado;
}

/**
 * Obtiene la ficha detallada de un patrón activo por su slug. Devuelve null si no existe o está inactivo.
 */
export async function obtenerPatronPorSlug(
  cliente: EntradaClienteSupabase,
  slug: string,
): Promise<PatronConRelaciones | null> {
  const supabase = resolverCliente(cliente);
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*), variantes:variantes_producto(*)")
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al consultar patrón por slug: ${error.message}`);
  }

  if (!data || data.activo !== true) {
    return null;
  }

  const producto = data as Producto & { categoria: Categoria; variantes: VarianteProducto[] };
  return enriquecerPatron(producto);
}

/**
 * Obtiene hasta N patrones activos de la misma categoría, excluyendo el patrón actual.
 */
export async function obtenerPatronesRelacionados(
  cliente: EntradaClienteSupabase,
  categoriaId: string,
  excluirProductoId: string,
  limite: number = 4,
): Promise<PatronConRelaciones[]> {
  const supabase = resolverCliente(cliente);
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*), variantes:variantes_producto(*)")
    .eq("categoria_id", categoriaId)
    .eq("activo", true)
    .neq("id", excluirProductoId)
    .order("creado_en", { ascending: false })
    .limit(limite);

  if (error) {
    throw new Error(`Error al consultar patrones relacionados: ${error.message}`);
  }

  const filas = (data ?? []) as (Producto & { categoria: Categoria; variantes: VarianteProducto[] })[];
  return filas.map(enriquecerPatron);
}

/**
 * Obtiene la lista única de tallas disponibles entre los patrones actualmente activos.
 */
export async function obtenerTallasDisponibles(cliente: EntradaClienteSupabase): Promise<string[]> {
  const supabase = resolverCliente(cliente);
  const { data, error } = await supabase
    .from("variantes_producto")
    .select("talla, producto:productos!inner(activo)")
    .eq("producto.activo", true);

  if (error) {
    throw new Error(`Error al consultar tallas disponibles: ${error.message}`);
  }

  const filas = (data ?? []) as { talla: string; producto?: { activo: boolean } }[];
  const tallasUnicas = Array.from(new Set(filas.map((f) => f.talla)));

  // Ordenar numéricamente si es posible, alfabéticamente en caso contrario
  return tallasUnicas.sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b, "es", { sensitivity: "base" });
  });
}
