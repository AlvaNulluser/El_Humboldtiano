import { describe, it, expect } from "vitest";
import { buildSearchIndex } from "../../src/utils/search";
import type { ProcessedArticle } from "../../src/content/utils";
import type { CollectionEntry } from "astro:content";

/**
 * Minimal article factory that satisfies the ProcessedArticle shape
 * enough for search.ts to consume. Fields not used by buildSearchIndex
 * are set to reasonable defaults or cast through `as unknown`.
 */
function makeArticle(
  overrides: Partial<Record<string, unknown>> = {},
): ProcessedArticle {
  const base = {
    id: "test-1",
    slug: "test-1",
    body: "Cuerpo completo del artículo para búsqueda de texto.",
    collection: "articles",
    readingTime: 5,
    data: {
      title: "Artículo de Prueba",
      author: "María Pérez",
      category: "Huellas",
      resumen: "Un resumen de prueba.",
      tags: ["investigación", "cultura"],
      publishDate: new Date("2026-05-15"),
      coverImage: undefined,
      destacado: false,
      status: "Listo",
    },
    ...overrides,
  } as ProcessedArticle;

  return base;
}

describe("buildSearchIndex", () => {
  it("returns an empty array for zero articles", () => {
    expect(buildSearchIndex([])).toEqual([]);
  });

  it("returns the correct shape for a single article", () => {
    const article = makeArticle();
    const result = buildSearchIndex([article]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "test-1",
      title: "Artículo de Prueba",
      resumen: "Un resumen de prueba.",
      category: "Huellas",
      tags: ["investigación", "cultura"],
      author: "María Pérez",
      body: "Cuerpo completo del artículo para búsqueda de texto.",
      url: "/articulo/test-1",
    });
  });

  it("returns one doc per article for multiple articles", () => {
    const a1 = makeArticle({ id: "art-a" });
    const a2 = makeArticle({ id: "art-b" });
    const result = buildSearchIndex([a1, a2]);

    expect(result).toHaveLength(2);
    expect(result[0].url).toBe("/articulo/art-a");
    expect(result[1].url).toBe("/articulo/art-b");
  });

  it("includes the full body text", () => {
    const article = makeArticle({ body: "Contenido especial para búsqueda." });
    const result = buildSearchIndex([article]);
    expect(result[0].body).toBe("Contenido especial para búsqueda.");
  });

  it("falls back to empty string when resumen is missing", () => {
    const article = makeArticle({
      data: {
        ...(makeArticle() as unknown as Record<string, unknown>).data,
        resumen: undefined,
      },
    });
    const result = buildSearchIndex([article]);
    expect(result[0].resumen).toBe("");
  });

  it("falls back to empty array when tags are missing", () => {
    const article = makeArticle({
      data: {
        ...(makeArticle() as unknown as Record<string, unknown>).data,
        tags: undefined,
      },
    });
    const result = buildSearchIndex([article]);
    expect(result[0].tags).toEqual([]);
  });

  it("generates correct URL from article id", () => {
    const article = makeArticle({ id: "mi-articulo-especial" });
    const result = buildSearchIndex([article]);
    expect(result[0].url).toBe("/articulo/mi-articulo-especial");
  });
});
