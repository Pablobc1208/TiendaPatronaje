import { describe, expect, it, vi } from "vitest";

import { comprobarSupabase } from "./estado";

const variables = { SUPABASE_URL: "https://abcd.supabase.co", SUPABASE_CLAVE_PUBLICA: "clave" };

describe("comprobarSupabase", () => {
  it("devuelve ok cuando Supabase responde 200", async () => {
    const pedir = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    await expect(comprobarSupabase(variables, pedir)).resolves.toEqual({ estado: "ok" });
    expect(pedir).toHaveBeenCalledWith(
      "https://abcd.supabase.co/auth/v1/health",
      expect.objectContaining({ headers: { apikey: "clave" } }),
    );
  });

  it("avisa si faltan las variables, sin llamar a la red", async () => {
    const pedir = vi.fn();
    const resultado = await comprobarSupabase({}, pedir);
    expect(resultado.estado).toBe("sin_configurar");
    expect(pedir).not.toHaveBeenCalled();
  });

  it("devuelve error con el código si Supabase no responde 200", async () => {
    const pedir = vi.fn().mockResolvedValue(new Response("", { status: 401 }));
    await expect(comprobarSupabase(variables, pedir)).resolves.toEqual({
      estado: "error",
      detalle: "Supabase respondió 401.",
    });
  });

  it("devuelve error si la red falla", async () => {
    const pedir = vi.fn().mockRejectedValue(new Error("sin conexión"));
    const resultado = await comprobarSupabase(variables, pedir);
    expect(resultado).toEqual({
      estado: "error",
      detalle: "No se pudo contactar con Supabase: sin conexión",
    });
  });
});
