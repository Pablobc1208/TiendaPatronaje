/** Datos públicos para conectar con Supabase desde el servidor o el navegador. */
export interface ConfiguracionSupabase {
  url: string;
  clavePublica: string;
}

/** Variables de entorno de las que se lee la configuración de Supabase. */
export interface VariablesSupabase {
  SUPABASE_URL?: string;
  SUPABASE_CLAVE_PUBLICA?: string;
}

/**
 * Lee y valida la configuración de Supabase.
 * Falla con un mensaje claro si falta alguna variable o la URL no es válida,
 * para no descubrir el problema más tarde con un error críptico de red.
 */
export function leerConfiguracionSupabase(variables: VariablesSupabase): ConfiguracionSupabase {
  const url = variables.SUPABASE_URL?.trim();
  const clavePublica = variables.SUPABASE_CLAVE_PUBLICA?.trim();

  const faltan: string[] = [];
  if (!url) faltan.push("SUPABASE_URL");
  if (!clavePublica) faltan.push("SUPABASE_CLAVE_PUBLICA");
  if (faltan.length > 0) {
    throw new Error(
      `Faltan variables de entorno de Supabase: ${faltan.join(", ")}. ` +
        "En local, cópialas en .dev.vars (ver .dev.vars.example); en Cloudflare, en las variables del Worker.",
    );
  }

  let urlValida: URL;
  try {
    urlValida = new URL(url!);
  } catch {
    throw new Error(`SUPABASE_URL no es una URL válida: "${url}".`);
  }
  if (
    urlValida.protocol !== "https:" &&
    urlValida.hostname !== "127.0.0.1" &&
    urlValida.hostname !== "localhost"
  ) {
    throw new Error("SUPABASE_URL debe usar https (salvo en local).");
  }

  return { url: urlValida.origin, clavePublica: clavePublica! };
}
