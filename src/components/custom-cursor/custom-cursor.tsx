import {
  component$,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";

/**
 * 自訂游標：一個實心點 (dot) 與一個跟隨的外環 (ring)。
 * - 只在具備精細指標 (hover + fine) 的裝置啟用，並在掛載後才隱藏系統游標。
 * - ring 用 lerp 平滑跟隨（取代原本的 setTimeout，避免快速移動時排隊堆積）。
 * - hover 放大改用事件委派 (mouseover/mouseout)，對動態內容也有效。
 */
export const CustomCursor = component$(() => {
  useStylesScoped$(`
    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 6px;
      height: 6px;
      background: #ffffff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10001;
      mix-blend-mode: difference;
    }

    .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border: 1px solid #ffffff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10000;
      transition: width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s;
      opacity: 0.5;
      mix-blend-mode: difference;
    }

    @media (hover: none), (pointer: coarse) {
      .cursor-dot,
      .cursor-ring {
        display: none;
      }
    }
  `);

  const dotRef = useSignal<HTMLDivElement>();
  const ringRef = useSignal<HTMLDivElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    // 僅在精細指標裝置啟用自訂游標
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const dot = dotRef.value;
    const ring = ringRef.value;
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    let rafId = 0;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(loop);
    };

    const isInteractive = (el: EventTarget | null) =>
      el instanceof Element && el.closest("a, .card");

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) {
        ring.style.width = "60px";
        ring.style.height = "60px";
        ring.style.borderColor = "var(--accent-rust)";
        ring.style.backgroundColor = "rgba(181, 101, 67, 0.1)";
      }
    };

    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target) && !isInteractive(e.relatedTarget)) {
        ring.style.width = "40px";
        ring.style.height = "40px";
        ring.style.borderColor = "#ffffff";
        ring.style.backgroundColor = "transparent";
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    loop();

    cleanup(() => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("custom-cursor-active");
    });
  });

  return (
    <>
      <div class="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div class="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
});
