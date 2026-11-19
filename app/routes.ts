import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Mapa de rutas de la tienda. Las rutas de /admin se añadirán en EPIC7.
export default [
  index("routes/inicio.tsx"),
  route("api/estado", "routes/api.estado.ts"),
] satisfies RouteConfig;
