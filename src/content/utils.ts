import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

/** Palabras por minuto para lectura en español */
const WPM = 200;

/**
 * Calcula el tiempo de lectura estimado a partir del texto.
 * Fórmula: cantidad de palabras ÷ 200 wpm (español estándar).
 */
export function computeReadingTime(body: string): number {
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  return Math.max(0, Math.ceil(wordCount / WPM));
}

/** Tipo de artículo procesado, incluye readingTime calculado */
export type ProcessedArticle = CollectionEntry<"articles"> & {
  readingTime: number;
};

/**
 * Obtiene los artículos de la colección y calcula el tiempo de lectura
 * a partir del cuerpo de cada artículo. Equivale a un "collection transform".
 *
 * Solo devuelve artículos con status === "Listo" por defecto.
 */
export async function getArticles(
  filter?: (entry: CollectionEntry<"articles">) => boolean,
): Promise<ProcessedArticle[]> {
  const all = await getCollection("articles");

  const filtered = filter
    ? all.filter(filter)
    : all.filter((entry) => entry.data.status === "Listo");

  return filtered.map((entry) => ({
    ...entry,
    readingTime: computeReadingTime(entry.body ?? ""),
  }));
}
