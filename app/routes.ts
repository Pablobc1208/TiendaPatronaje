import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Mapa de rutas de la tienda. Las rutas de /admin se añadirán en EPIC7.
export default [
  index("routes/inicio.tsx"),
  route("patrones", "routes/patrones._index.tsx"),
  // Muestra de la guía visual para que el PM la apruebe. No se enlaza ni se indexa.
  route("guia-visual", "routes/guia-visual.tsx"),
  route("api/estado", "routes/api.estado.ts"),
] satisfies RouteConfig;
