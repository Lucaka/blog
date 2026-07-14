import { component$, useStylesScoped$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  useStylesScoped$(`
    .simple-footer {
      margin-top: 5rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-sub);
      opacity: 0.7;
    }
  `);

  return (
    <div class="simple-footer">
      <p>END OF TRANSMISSION // SYSTEM STANDBY</p>
    </div>
  );
});
