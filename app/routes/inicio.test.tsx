import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Inicio from "./inicio";

describe("Inicio", () => {
  it("muestra el nombre de la tienda", () => {
    render(<Inicio />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Clemen Corbacho Patronaje");
  });
});
