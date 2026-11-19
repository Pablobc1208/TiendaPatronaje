import { defineConfig } from "vitest/config";

// Configuración de los tests unitarios. Va aparte de vite.config.ts para no
// cargar los plugins de Cloudflare y React Router al ejecutar Vitest.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["app/**/*.test.{ts,tsx}", "workers/**/*.test.ts"],
    setupFiles: ["./tests/preparacion.ts"],
  },
});
