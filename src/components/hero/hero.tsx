import { component$, useStylesScoped$ } from "@builder.io/qwik";

export const Hero = component$(() => {
  useStylesScoped$(`
    .hero-text {
      text-align: center;
      margin-bottom: 6rem;
      position: relative;
    }

    .hero-text h1 {
      font-size: clamp(3rem, 7vw, 6rem);
      color: #fff; /* 在深色廢墟背景上使用白色 */
      text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      letter-spacing: 4px;
      font-weight: 400;
    }

    .subtitle {
      display: inline-block;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(5px);
      color: #ddd;
      padding: 5px 15px;
      font-size: 0.8rem;
      letter-spacing: 3px;
      margin-top: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
      .hero-text h1 {
        font-size: 3rem;
      }
    }
  `);

  return (
    <div class="hero-text">
      <h1>
        STRUCTURAL
        <br />
        DECAY
      </h1>
      <span class="subtitle">SECTOR 09 // NO HUMAN CONTACT</span>
    </div>
  );
});
