import { describe, it, expect } from "vitest";
import { organizeHomepageArticles } from "../../src/utils/editorialLayout";
import type { ProcessedArticle } from "../../src/content/utils";
import type { CategoryDefinition } from "../../src/utils/slugify";

const TEST_CATEGORIES: CategoryDefinition[] = [
  {
    name: "Vida Universitaria",
    slug: "vida-universitaria",
    description: "Acontecimientos del campus.",
  },
  {
    name: "Huellas",
    slug: "huellas",
    description: "Crónicas y memoria histórica.",
  },
  {
    name: "Ciudad y Arte",
    slug: "ciudad-y-arte",
    description: "Cultura y expresiones artísticas.",
  },
  {
    name: "En Radar",
    slug: "en-radar",
    description: "Tendencias y tecnología.",
  },
];

function createArticle(
  id: string,
  category: string,
  dateStr: string,
  destacado = false,
): ProcessedArticle {
  return {
    id,
    collection: "articles",
    data: {
      title: `Article ${id}`,
      category,
      tags: [],
      author: "Redacción",
      publishDate: new Date(dateStr),
      destacado,
      status: "Listo",
    },
    readingTime: 3,
  } as unknown as ProcessedArticle;
}

describe("organizeHomepageArticles", () => {
  it("handles empty articles list and returns all 4 canonical categories with empty articles", () => {
    const result = organizeHomepageArticles([], TEST_CATEGORIES);
    expect(result.featured).toBeNull();
    expect(result.categories).toHaveLength(4);
    expect(result.categories.every((c) => c.articles.length === 0)).toBe(true);
  });

  it("prioritizes article with destacado=true as featured without duplicating in its category", () => {
    const art1 = createArticle("1", "Huellas", "2026-03-01", false);
    const art2 = createArticle("2", "Vida Universitaria", "2026-02-01", true);

    const result = organizeHomepageArticles([art1, art2], TEST_CATEGORIES);
    expect(result.featured?.id).toBe("2");

    const huellas = result.categories.find((c) => c.name === "Huellas");
    const vida = result.categories.find((c) => c.name === "Vida Universitaria");

    expect(huellas?.articles.map((a) => a.id)).toEqual(["1"]);
    // art2 is featured, so vida has 0 remaining articles
    expect(vida?.articles).toEqual([]);
  });

  it("routes articles directly to their respective category sections", () => {
    const featured = createArticle(
      "feat",
      "Vida Universitaria",
      "2026-05-01",
      true,
    );
    const huellas1 = createArticle("h1", "Huellas", "2026-04-01");
    const radar1 = createArticle("r1", "En Radar", "2026-03-15");
    const arte1 = createArticle("a1", "Ciudad y Arte", "2026-03-01");
    const vida2 = createArticle("v2", "Vida Universitaria", "2026-02-01");

    const result = organizeHomepageArticles(
      [featured, huellas1, radar1, arte1, vida2],
      TEST_CATEGORIES,
    );

    expect(result.featured?.id).toBe("feat");

    const vida = result.categories.find((c) => c.name === "Vida Universitaria");
    const huellas = result.categories.find((c) => c.name === "Huellas");
    const arte = result.categories.find((c) => c.name === "Ciudad y Arte");
    const radar = result.categories.find((c) => c.name === "En Radar");

    expect(vida?.articles.map((a) => a.id)).toEqual(["v2"]);
    expect(huellas?.articles.map((a) => a.id)).toEqual(["h1"]);
    expect(arte?.articles.map((a) => a.id)).toEqual(["a1"]);
    expect(radar?.articles.map((a) => a.id)).toEqual(["r1"]);
  });

  it("caps category articles to 3 when there are many articles in one category", () => {
    const featured = createArticle("feat", "Huellas", "2026-06-01", true);
    const articles = [
      featured,
      createArticle("h1", "Huellas", "2026-05-01"),
      createArticle("h2", "Huellas", "2026-04-01"),
      createArticle("h3", "Huellas", "2026-03-01"),
      createArticle("h4", "Huellas", "2026-02-01"),
    ];

    const result = organizeHomepageArticles(articles, TEST_CATEGORIES);
    expect(result.featured?.id).toBe("feat");

    const huellas = result.categories.find((c) => c.name === "Huellas");
    expect(huellas?.articles).toHaveLength(3);
    expect(huellas?.articles.map((a) => a.id)).toEqual(["h1", "h2", "h3"]);
  });
});
