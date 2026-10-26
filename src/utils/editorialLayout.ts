import type { ProcessedArticle } from "../content/utils";
import type { CategoryDefinition } from "./slugify";

export interface CategorizedSection {
  name: string;
  slug: string;
  description: string;
  articles: ProcessedArticle[];
}

export interface HomepageLayout {
  featured: ProcessedArticle | null;
  categories: CategorizedSection[];
}

/**
 * Organizes articles for the broadsheet homepage:
 * - Sorts by publish date descending.
 * - Extracts 1 featured article (favoring data.destacado).
 * - Distributes all remaining articles directly into their respective thematic category (up to 3 per category).
 * - Preserves all canonical categories so the student portal maintains its clear section identity.
 */
export function organizeHomepageArticles(
  articles: ProcessedArticle[],
  categories: CategoryDefinition[],
): HomepageLayout {
  const sorted = [...articles].sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  const featured = sorted.find((a) => a.data.destacado) || sorted[0] || null;

  const displayedIds = new Set<string>();
  if (featured) displayedIds.add(featured.id);

  const categorySections: CategorizedSection[] = categories.map((cat) => {
    const catArticles = sorted
      .filter((a) => a.data.category === cat.name && !displayedIds.has(a.id))
      .slice(0, 3);

    for (const a of catArticles) {
      displayedIds.add(a.id);
    }

    return {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      articles: catArticles,
    };
  });

  return { featured, categories: categorySections };
}
