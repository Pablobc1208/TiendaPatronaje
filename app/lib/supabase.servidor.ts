import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

import { leerConfiguracionSupabase, type VariablesSupabase } from "./configuracion";

/**
 * Crea un cliente de Supabase para usar en loaders y actions (servidor).
 *
 * Usa solo la clave pública: los permisos los decide Row Level Security según
 * la sesión del usuario, que viaja en las cookies de la petición.
 * Si Supabase renueva la sesión, las cookies nuevas se añaden a `cabeceras`,
 * que hay que devolver en la respuesta del loader o action.
 *
 * Ejemplo:
 *   const { env } = context.get(contextoCloudflare);
 *   const { supabase, cabeceras } = crearClienteSupabaseServidor(request, env);
 *   const { data } = await supabase.from("productos").select();
 *   return data(productos, { headers: cabeceras });
 */
export function crearClienteSupabaseServidor(peticion: Request, variables: VariablesSupabase) {
  const { url, clavePublica } = leerConfiguracionSupabase(variables);
  const cabeceras = new Headers();

  const supabase = createServerClient(url, clavePublica, {
    cookies: {
      getAll() {
        return parseCookieHeader(peticion.headers.get("Cookie") ?? "").map(({ name, value }) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(cookies, cabecerasExtra) {
        for (const { name, value, options } of cookies) {
          cabeceras.append("Set-Cookie", serializeCookieHeader(name, value, options));
        }
        // Cabeceras anti-caché que pide Supabase para que una sesión no se sirva a otro usuario.
        for (const [nombre, valor] of Object.entries(cabecerasExtra ?? {})) {
          cabeceras.set(nombre, valor);
        }
      },
    },
  });

  return { supabase, cabeceras };
}
