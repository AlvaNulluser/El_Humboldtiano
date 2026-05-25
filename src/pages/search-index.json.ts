import type { APIRoute } from "astro";
import { getArticles } from "../content/utils";
import { buildSearchIndex } from "../utils/search";

/**
 * Build-time static JSON endpoint — generates the client-side
 * search index at /search-index.json. Used by /buscar.
 */
export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const index = buildSearchIndex(articles);

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
