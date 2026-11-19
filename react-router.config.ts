import type { Config } from "@react-router/dev/config";

export default {
  // Renderizado en servidor para que el catálogo y las fichas se indexen en Google.
  ssr: true,
} satisfies Config;
