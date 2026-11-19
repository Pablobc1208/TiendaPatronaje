import type { VariablesSupabase } from "./configuracion";
import { leerConfiguracionSupabase } from "./configuracion";

/** Resultado de comprobar la conexión con Supabase. */
export type EstadoSupabase =
  { estado: "ok" } | { estado: "sin_configurar"; detalle: string } | { estado: "error"; detalle: string };

/**
 * Comprueba que Supabase está configurado y responde, llamando al endpoint de
 * salud de Auth. No necesita tablas, así que funciona desde el primer día.
 * `pedir` se inyecta para poder probarlo sin red.
 */
export async function comprobarSupabase(
  variables: VariablesSupabase,
  pedir: typeof fetch = fetch,
): Promise<EstadoSupabase> {
  let configuracion;
  try {
    configuracion = leerConfiguracionSupabase(variables);
  } catch (error) {
    return { estado: "sin_configurar", detalle: (error as Error).message };
  }

  try {
    const respuesta = await pedir(`${configuracion.url}/auth/v1/health`, {
      headers: { apikey: configuracion.clavePublica },
      signal: AbortSignal.timeout(5_000),
    });
    if (!respuesta.ok) {
      return { estado: "error", detalle: `Supabase respondió ${respuesta.status}.` };
    }
    return { estado: "ok" };
  } catch (error) {
    return { estado: "error", detalle: `No se pudo contactar con Supabase: ${(error as Error).message}` };
  }
}
