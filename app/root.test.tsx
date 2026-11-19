import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErrorBoundary } from "./root";

describe("ErrorBoundary", () => {
  it("muestra el mensaje 404 en español para rutas inexistentes (AC1.4)", () => {
    const error404 = {
      status: 404,
      statusText: "Not Found",
      data: null,
      internal: false,
    };

    render(<ErrorBoundary error={error404} params={{}} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Página no encontrada");
    expect(screen.getByText("La página que buscas no existe o se ha movido.")).toBeInTheDocument();
  });

  it("muestra error con código de estado para otros códigos HTTP", () => {
    const error500 = {
      status: 500,
      statusText: "Internal Server Error",
      data: null,
      internal: false,
    };

    render(<ErrorBoundary error={error500} params={{}} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Error 500");
  });
});
