import rss from "@astrojs/rss";
import { getArticles } from "../content/utils";

export async function GET(context) {
  const articles = await getArticles();
  articles.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  return rss({
    title: "El Humboldtiano",
    description:
      "Periódico universitario de la Universidad Alejandro de Humboldt. Cultura, arte, vida universitaria y más.",
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description:
        article.data.resumen ||
        `Artículo de ${article.data.author} en la categoría ${article.data.category}.`,
      pubDate: article.data.publishDate,
      link: `/articulo/${article.id}`,
      categories: [article.data.category, ...article.data.tags],
      author: article.data.author,
    })),
    customData: `<language>es</language>`,
  });
}
