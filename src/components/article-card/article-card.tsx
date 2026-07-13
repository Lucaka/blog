import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { Article } from "~/data/articles";

export const ArticleCard = component$<Article>((article) => {
  useStylesScoped$(`
    .card {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.4);
      padding: 3rem 2rem;
      transition:
        transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
        border-color 0.3s;
      position: relative;
      backdrop-filter: blur(10px);
      /* 微微的傾斜效果增加不穩定感 */
      clip-path: polygon(0 0, 100% 0, 100% 98%, 95% 100%, 0 100%);
    }

    .card:hover {
      transform: translateY(-10px);
      border-color: var(--accent-rust);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    }

    .card-meta {
      font-size: 0.7rem;
      color: var(--accent-moss);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
      padding-bottom: 10px;
    }

    .card h2 {
      margin-bottom: 1rem;
      font-size: 1.8rem;
      line-height: 1.1;
      color: var(--text-main);
    }

    .card p {
      color: var(--text-sub);
      font-size: 0.95rem;
      margin-bottom: 2rem;
      line-height: 1.8;
    }

    .card-link {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent-rust);
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .card-link::after {
      content: "→";
      transition: 0.3s;
    }

    .card-link:hover::after {
      transform: translateX(5px);
    }
  `);

  return (
    <article class="card">
      <div class="card-meta">
        <span>{article.category}</span>
        <span>{article.tag}</span>
      </div>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
      <a href={article.href} class="card-link">
        {article.linkLabel}
      </a>
    </article>
  );
});
