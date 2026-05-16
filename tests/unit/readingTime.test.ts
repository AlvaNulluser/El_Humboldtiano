import { describe, it, expect, vi } from "vitest";

// astro:content es módulo virtual de Astro — necesita mock incluso
// si computeReadingTime no lo usa (el import está en el mismo archivo).
vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
  defineCollection: () => ({}),
  z: {},
}));

import { computeReadingTime } from "../../src/content/utils";

describe("computeReadingTime", () => {
  it("calcula 600 palabras → 3 minutos (200 wpm)", () => {
    const words = Array(600).fill("palabra").join(" ");
    expect(computeReadingTime(words)).toBe(3);
  });

  it("0 palabras → 0 minutos", () => {
    expect(computeReadingTime("")).toBe(0);
  });

  it("1 palabra → 1 minuto", () => {
    expect(computeReadingTime("Hola")).toBe(1);
  });

  it("200 palabras justas → 1 minuto", () => {
    const words = Array(200).fill("x").join(" ");
    expect(computeReadingTime(words)).toBe(1);
  });

  it("201 palabras → 2 minutos (redondeo hacia arriba)", () => {
    const words = Array(201).fill("x").join(" ");
    expect(computeReadingTime(words)).toBe(2);
  });
});
