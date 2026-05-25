/**
 * Search index builder — generates a client-searchable JSON array
 * from all published articles at build time.
 */
import type { ProcessedArticle } from "../content/utils";

export interface SearchDoc {
  id: string;
  title: string;
  resumen: string;
  category: string;
  tags: string[];
  author: string;
  body: string;
  url: string;
}

/**
 * Builds a search-ready document array from processed articles.
 * Each document contains the full metadata + body text for
 * case-insensitive client-side matching.
 */
export function buildSearchIndex(articles: ProcessedArticle[]): SearchDoc[] {
  return articles.map((article) => ({
    id: article.id,
    title: article.data.title,
    resumen: article.data.resumen ?? "",
    category: article.data.category,
    tags: article.data.tags ?? [],
    author: article.data.author,
    body: article.body ?? "",
    url: `/articulo/${article.id}`,
  }));
}
