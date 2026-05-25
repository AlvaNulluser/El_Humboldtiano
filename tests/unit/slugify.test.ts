import { describe, it, expect } from "vitest";
import { slugify, deslugify, CATEGORIES } from "../../src/utils/slugify";

describe("slugify", () => {
  it("converts 'Vida Universitaria' → 'vida-universitaria'", () => {
    expect(slugify("Vida Universitaria")).toBe("vida-universitaria");
  });

  it("converts 'Huellas' → 'huellas'", () => {
    expect(slugify("Huellas")).toBe("huellas");
  });

  it("converts 'Ciudad y Arte' → 'ciudad-y-arte'", () => {
    expect(slugify("Ciudad y Arte")).toBe("ciudad-y-arte");
  });

  it("converts 'En Radar' → 'en-radar'", () => {
    expect(slugify("En Radar")).toBe("en-radar");
  });

  it("strips special characters", () => {
    expect(slugify("¡Hola! ¿Qué tal?")).toBe("hola-qu-tal");
  });

  it("collapses multiple spaces into a single hyphen", () => {
    expect(slugify("Muchos   espacios")).toBe("muchos-espacios");
  });

  it("handles leading and trailing whitespace", () => {
    expect(slugify("  Con Espacios  ")).toBe("con-espacios");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("deslugify", () => {
  it("reverse-maps 'vida-universitaria' → 'Vida Universitaria'", () => {
    expect(deslugify("vida-universitaria")).toBe("Vida Universitaria");
  });

  it("reverse-maps 'huellas' → 'Huellas'", () => {
    expect(deslugify("huellas")).toBe("Huellas");
  });

  it("reverse-maps 'ciudad-y-arte' → 'Ciudad y Arte'", () => {
    expect(deslugify("ciudad-y-arte")).toBe("Ciudad y Arte");
  });

  it("reverse-maps 'en-radar' → 'En Radar'", () => {
    expect(deslugify("en-radar")).toBe("En Radar");
  });

  it("returns slug as-is for unknown input", () => {
    expect(deslugify("categoria-inexistente")).toBe("categoria-inexistente");
  });
});

describe("CATEGORIES bijection", () => {
  it("every category round-trips: slugify → deslugify → original name", () => {
    for (const { name } of CATEGORIES) {
      const slug = slugify(name);
      const roundtrip = deslugify(slug);
      expect(roundtrip).toBe(name);
    }
  });

  it("every slug is unique", () => {
    const slugs = CATEGORIES.map((c) => slugify(c.name));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("contains exactly 4 categories", () => {
    expect(CATEGORIES).toHaveLength(4);
  });
});
