import { contextoCloudflare } from "~/lib/contexto";
import { comprobarSupabase } from "~/lib/estado";

import type { Route } from "./+types/api.estado";

/**
 * GET /api/estado: comprobación rápida de que la tienda está desplegada y
 * conectada a Supabase. Útil tras cada despliegue. No expone datos sensibles.
 */
export async function loader({ context }: Route.LoaderArgs) {
  const { env } = context.get(contextoCloudflare);
  const supabase = await comprobarSupabase(env);
  return Response.json(
    { tienda: "ok", supabase },
    { status: supabase.estado === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
