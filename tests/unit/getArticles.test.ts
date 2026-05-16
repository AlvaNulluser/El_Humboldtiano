import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock de astro:content ──────────────────────────────────
// vi.hoisted asegura que la variable exista antes de que
// vi.mock (hoisted) intente usarla.
const { mockGetCollection } = vi.hoisted(() => ({
  mockGetCollection: vi.fn(),
}));

vi.mock("astro:content", () => ({
  getCollection: mockGetCollection,
  defineCollection: () => ({}),
  z: {},
}));

import { getArticles } from "../../src/content/utils";

// ─── Helpers para construir entries de prueba ───────────────
function makeEntry(overrides: Record<string, unknown> = {}) {
  const data = {
    title: "Artículo de prueba",
    category: "Vida Universitaria",
    tags: [] as string[],
    author: "Autor Anónimo",
    publishDate: new Date("2026-01-15"),
    coverImage: undefined as string | undefined,
    resumen: undefined as string | undefined,
    destacado: false,
    status: "Listo" as const,
    ...overrides,
  };

  return {
    id: `entry-${Math.random().toString(36).slice(2)}`,
    collection: "articles" as const,
    data,
    body: "Contenido del artículo de prueba.",
    render: vi.fn(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getArticles", () => {
  it("devuelve solo artículos con status === 'Listo'", async () => {
    const listo = makeEntry({ status: "Listo" as const });
    const borrador = makeEntry({ status: "Borrador" as const });
    const revision = makeEntry({ status: "En revisión" as const });

    mockGetCollection.mockResolvedValueOnce([listo, borrador, revision]);

    const articles = await getArticles();

    expect(articles).toHaveLength(1);
    expect(articles[0].data.status).toBe("Listo");
  });

  it("devuelve todos los Listo (el orden lo gestiona la página)", async () => {
    const oldest = makeEntry({
      status: "Listo" as const,
      publishDate: new Date("2025-06-01"),
    });
    const middle = makeEntry({
      status: "Listo" as const,
      publishDate: new Date("2026-01-15"),
    });
    const newest = makeEntry({
      status: "Listo" as const,
      publishDate: new Date("2026-03-20"),
    });

    mockGetCollection.mockResolvedValueOnce([middle, oldest, newest]);

    const articles = await getArticles();
    expect(articles).toHaveLength(3);
  });

  it("devuelve array vacío si no hay artículos Listo", async () => {
    mockGetCollection.mockResolvedValueOnce([
      makeEntry({ status: "Borrador" as const }),
      makeEntry({ status: "En revisión" as const }),
    ]);

    const articles = await getArticles();

    expect(articles).toHaveLength(0);
  });

  it("calcula readingTime para cada artículo", async () => {
    const entry = makeEntry({ status: "Listo" as const });
    // 600 palabras → 3 min
    entry.body = Array(600).fill("palabra").join(" ");

    mockGetCollection.mockResolvedValueOnce([entry]);

    const articles = await getArticles();

    expect(articles[0].readingTime).toBe(3);
  });

  it("permite filtro personalizado vía callback", async () => {
    const a = makeEntry({ status: "Listo" as const, title: "A" });
    const b = makeEntry({ status: "Listo" as const, title: "B" });
    const c = makeEntry({ status: "Listo" as const, title: "C" });

    mockGetCollection.mockResolvedValueOnce([a, b, c]);

    const articles = await getArticles(
      (entry) => entry.data.title === "B",
    );

    expect(articles).toHaveLength(1);
    expect(articles[0].data.title).toBe("B");
  });
});
