import { createRequestHandler, RouterContextProvider } from "react-router";

import { contextoCloudflare } from "../app/lib/contexto";

const manejarPeticion = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

/**
 * Punto de entrada del Worker de Cloudflare.
 * Pasa a React Router el entorno (variables y secretos) y el contexto de ejecución,
 * para que los loaders y actions puedan leerlos con `context.get(contextoCloudflare)`.
 */
export default {
  async fetch(peticion, env, ctx) {
    const contexto = new RouterContextProvider();
    contexto.set(contextoCloudflare, { env, ctx });
    return manejarPeticion(peticion, contexto);
  },
} satisfies ExportedHandler<Env>;
