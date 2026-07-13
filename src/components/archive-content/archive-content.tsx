import { component$ } from "@builder.io/qwik";
import { Hero } from "~/components/hero/hero";
import { ArticleCard } from "~/components/article-card/article-card";
import { Footer } from "~/components/footer/footer";
import { articles } from "~/data/articles";
import { useStylesScoped$ } from "@builder.io/qwik";

/** 兩個頁面共用的主要內容：大標題、文章卡片網格、頁尾。 */
export const ArchiveContent = component$(() => {
  useStylesScoped$(`
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
    }
  `);

  return (
    <div class="main-container">
      <Hero />
      <div class="content-grid">
        {articles.map((article) => (
          <ArticleCard key={article.title} {...article} />
        ))}
      </div>
      <Footer />
    </div>
  );
});
