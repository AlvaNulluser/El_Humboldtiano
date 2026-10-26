/**
 * CATEGORIES — canonical category registry.
 * Single source of truth for name ↔ slug mapping.
 * Bijective: every name maps to exactly one slug and vice versa.
 */
export interface CategoryDefinition {
  name: string;
  slug: string;
  description: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    name: "Vida Universitaria",
    slug: "vida-universitaria",
    description:
      "Acontecimientos del campus, proyectos académicos y vida estudiantil en la Universidad Alejandro de Humboldt.",
  },
  {
    name: "Huellas",
    slug: "huellas",
    description:
      "Crónicas, memoria histórica, testimonios y trayectoria de egresados y profesores de nuestra comunidad.",
  },
  {
    name: "Ciudad y Arte",
    slug: "ciudad-y-arte",
    description:
      "Cultura, expresiones artísticas, exposiciones, literatura y la movida urbana de Caracas y el país.",
  },
  {
    name: "En Radar",
    slug: "en-radar",
    description:
      "Tendencias, innovación, ciencia, tecnología y debates contemporáneos en el foco universitario.",
  },
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
