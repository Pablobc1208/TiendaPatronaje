import { createContext } from "react-router";

/** Lo que el Worker de Cloudflare pone a disposición de loaders y actions. */
export interface DatosCloudflare {
  env: Env;
  ctx: ExecutionContext;
}

/** Clave de contexto para leer el entorno de Cloudflare: `context.get(contextoCloudflare)`. */
export const contextoCloudflare = createContext<DatosCloudflare>();
