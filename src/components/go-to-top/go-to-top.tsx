import { component$, useStylesScoped$, $ } from "@builder.io/qwik";

export const GoToTop = component$(() => {
  useStylesScoped$(`
    .gototop {
      position: fixed;
      bottom: 3rem;
      right: 3rem;
      width: 50px;
      height: 50px;
      background: transparent;
      border: 1px solid var(--accent-rust);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-rust);
      cursor: pointer;
      z-index: 100;
      opacity: 0.6;
      transition: 0.3s;
      font: inherit;
    }

    .gototop:hover {
      opacity: 1;
      background: var(--accent-rust);
      color: white;
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .gototop {
        bottom: 1.5rem;
        right: 1.5rem;
      }
    }
  `);

  return (
    <button
      type="button"
      class="gototop"
      aria-label="回到頂端"
      onClick$={$(() => window.scrollTo({ top: 0, behavior: "smooth" }))}
    >
      ↑
    </button>
  );
});
