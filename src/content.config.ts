import { defineCollection } from "astro:content";
import { z } from "astro/zod";
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

// ─── Normalización de etiquetas ───────────────────────────
const normalizeTag = (val: string): (typeof TAGS)[number] | string => {
  const clean = val.trim();
  const found = TAGS.find(
    (t) => t.localeCompare(clean, "es", { sensitivity: "base" }) === 0,
  );
  return found ?? clean;
};

// ─── Esquema Zod para artículos ───────────────────────────
const articleSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.enum(CATEGORIES),
  tags: z
    .preprocess(
      (val) =>
        Array.isArray(val)
          ? val.map((v) => (typeof v === "string" ? normalizeTag(v) : v))
          : (val ?? []),
      z.array(z.enum(TAGS)).max(5),
    )
    .default([]),
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