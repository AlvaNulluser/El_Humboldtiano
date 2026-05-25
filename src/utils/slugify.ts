/**
 * CATEGORIES — canonical category registry.
 * Single source of truth for name ↔ slug mapping.
 * Bijective: every name maps to exactly one slug and vice versa.
 */
export const CATEGORIES: { name: string; slug: string }[] = [
  { name: "Vida Universitaria", slug: "vida-universitaria" },
  { name: "Huellas", slug: "huellas" },
  { name: "Ciudad y Arte", slug: "ciudad-y-arte" },
  { name: "En Radar", slug: "en-radar" },
];

/**
 * Converts a category name to its URL-safe slug.
 * Lowercase, replace spaces with hyphens, strip special characters.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Reverse lookup: given a slug, returns the original category name.
 * If the slug is unknown, returns the slug as-is.
 */
export function deslugify(slug: string): string {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found ? found.name : slug;
}
