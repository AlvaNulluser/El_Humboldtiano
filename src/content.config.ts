import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ─── Categorías ───────────────────────────────────────────
const CATEGORIES = [
  "Vida Universitaria",
  "Huellas",
  "Ciudad y Arte",
  "En Radar",
] as const;

// ─── Etiquetas ────────────────────────────────────────────
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

// ─── Estados del flujo editorial ──────────────────────────
const STATUS = ["Borrador", "En revisión", "Listo"] as const;

// ─── Esquema Zod para artículos ───────────────────────────
const articleSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.enum(CATEGORIES),
  tags: z.array(z.enum(TAGS)).max(5),
  author: z.string().min(1),
  publishDate: z.coerce.date(),
  coverImage: z.string().optional(),
  resumen: z.string().optional(),
  destacado: z.boolean().default(false),
  status: z.enum(STATUS),
});

// ─── Colección ────────────────────────────────────────────
const articles = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/articles" }),
  schema: articleSchema,
});

export const collections = { articles };