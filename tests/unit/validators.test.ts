import { describe, it, expect } from "vitest";
import { z } from "zod";

// ─── Réplicas exactas de las constantes de src/content/config.ts ───
const CATEGORIES = [
  "Vida Universitaria",
  "Huellas",
  "Ciudad y Arte",
  "En Radar",
] as const;

const TAGS = [
  "Música",
  "Cine",
  "Arte Urbano",
  "Literatura",
  "Teatro",
  "Videojuegos",
  "Urbano",
  "Indie",
  "Caracas",
  "Internacional",
  "Europa",
  "Latinoamérica",
  "Norteamérica",
  "Emprendimiento",
  "Investigación",
  "Egresados",
  "Clubes",
  "Administrativo",
  "Deportes",
  "Ciencia",
  "Economía",
  "Tecnología",
  "Historia",
] as const;

const categorySchema = z.enum(CATEGORIES);
const tagsSchema = z.array(z.enum(TAGS)).max(5);

describe("Category validator", () => {
  it("acepta categorías válidas (4)", () => {
    for (const cat of CATEGORIES) {
      expect(() => categorySchema.parse(cat)).not.toThrow();
    }
    // Verify exactly 4 categories
    expect(CATEGORIES).toHaveLength(4);
  });

  it("rechaza categoría inválida", () => {
    expect(() => categorySchema.parse("Deportes")).toThrow();
    expect(() => categorySchema.parse("Misterio")).toThrow();
    expect(() => categorySchema.parse("")).toThrow();
  });
});

describe("Tags validator", () => {
  it("acepta subconjunto de etiquetas válidas", () => {
    const validSubset = ["Música", "Cine", "Arte Urbano"];
    expect(() => tagsSchema.parse(validSubset)).not.toThrow();
  });

  it("acepta lista vacía de etiquetas", () => {
    expect(() => tagsSchema.parse([])).not.toThrow();
  });

  it("rechaza etiqueta inválida", () => {
    expect(() => tagsSchema.parse(["Astronomía"])).toThrow();
  });

  it("rechaza más de 5 etiquetas", () => {
    const sixTags = [
      "Música",
      "Cine",
      "Arte Urbano",
      "Literatura",
      "Teatro",
      "Videojuegos",
    ];
    expect(() => tagsSchema.parse(sixTags)).toThrow();
  });

  it("todas las etiquetas del whitelist son válidas", () => {
    for (const tag of TAGS) {
      expect(() => tagsSchema.parse([tag])).not.toThrow();
    }
    expect(TAGS).toHaveLength(23);
  });
});
