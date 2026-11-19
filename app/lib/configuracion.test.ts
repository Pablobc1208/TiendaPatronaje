import { describe, expect, it } from "vitest";

import { leerConfiguracionSupabase } from "./configuracion";

describe("leerConfiguracionSupabase", () => {
  it("devuelve la URL y la clave cuando están bien", () => {
    const configuracion = leerConfiguracionSupabase({
      SUPABASE_URL: "https://abcd.supabase.co/",
      SUPABASE_CLAVE_PUBLICA: "sb_publishable_123",
    });
    expect(configuracion).toEqual({ url: "https://abcd.supabase.co", clavePublica: "sb_publishable_123" });
  });

  it("nombra todas las variables que faltan", () => {
    expect(() => leerConfiguracionSupabase({})).toThrow("SUPABASE_URL, SUPABASE_CLAVE_PUBLICA");
  });

  it("trata una variable vacía o con solo espacios como ausente", () => {
    expect(() => leerConfiguracionSupabase({ SUPABASE_URL: "  ", SUPABASE_CLAVE_PUBLICA: "clave" })).toThrow(
      "Faltan variables de entorno de Supabase: SUPABASE_URL.",
    );
  });

  it("rechaza una URL mal formada", () => {
    expect(() =>
      leerConfiguracionSupabase({ SUPABASE_URL: "no-es-una-url", SUPABASE_CLAVE_PUBLICA: "clave" }),
    ).toThrow("no es una URL válida");
  });

  it("exige https salvo en local", () => {
    expect(() =>
      leerConfiguracionSupabase({ SUPABASE_URL: "http://abcd.supabase.co", SUPABASE_CLAVE_PUBLICA: "clave" }),
    ).toThrow("https");
    expect(
      leerConfiguracionSupabase({ SUPABASE_URL: "http://127.0.0.1:54321", SUPABASE_CLAVE_PUBLICA: "clave" })
        .url,
    ).toBe("http://127.0.0.1:54321");
  });
});
