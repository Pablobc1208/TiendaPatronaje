// Se ejecuta antes de cada fichero de tests: añade los matchers de Testing Library
// (toBeInTheDocument, toHaveTextContent…) y limpia el DOM entre tests.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
