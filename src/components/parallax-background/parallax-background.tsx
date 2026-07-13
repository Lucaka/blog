import {
  component$,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";

export type ParallaxMode = "mouse" | "scroll";

interface ParallaxBackgroundProps {
  /** mouse：滑鼠移動視差；scroll：捲動視差 */
  mode: ParallaxMode;
}

/**
 * 廢墟視差背景。依 mode 決定驅動方式：
 * - mouse：監聽 mousemove，用 lerp 阻尼平滑地移動 background-position。
 * - scroll：監聽 scroll，將捲動進度映射為 background-position-y。
 */
export const ParallaxBackground = component$<ParallaxBackgroundProps>(
  ({ mode }) => {
    useStylesScoped$(`
      .parallax-bg {
        position: fixed;
        z-index: -2;
        background-repeat: no-repeat;
      }

      .parallax-bg.mouse {
        top: -15vh;
        left: -15vw;
        width: 130vw;
        height: 130vh;
        background-size: 115%;
        background-position: center center;
        will-change: background-position;
      }

      .parallax-bg.scroll {
        top: 0;
        left: 0;
        width: 100%;
        height: 120vh; /* 比視窗高，防止向上滾動時底部穿幫 */
        background-size: cover;
        background-position: center center;
        will-change: background-position;
      }
    `);

    const bgRef = useSignal<HTMLDivElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const bg = bgRef.value;
      if (!bg) return;

      if (mode === "mouse") {
        let currentX = 50;
        let currentY = 50; // 初始在中心 (50%)
        let targetX = 50;
        let targetY = 50;
        const damping = 0.01; // 阻尼係數

        const onMouseMove = (e: MouseEvent) => {
          targetX = (e.clientX / window.innerWidth) * 100;
          targetY = (e.clientY / window.innerHeight) * 100;
        };

        let rafId = 0;
        const loop = () => {
          // Lerp 內插，平滑過渡
          currentX += (targetX - currentX) * damping;
          currentY += (targetY - currentY) * damping;
          bg.style.backgroundPosition = `${currentX}% ${currentY}%`;
          rafId = requestAnimationFrame(loop);
        };

        document.addEventListener("mousemove", onMouseMove);
        loop();

        cleanup(() => {
          cancelAnimationFrame(rafId);
          document.removeEventListener("mousemove", onMouseMove);
        });
      } else {
        const onScroll = () => {
          const scrollY = window.scrollY;
          const scrollHeight = document.body.scrollHeight;
          const yOffsetPercent =
            (scrollY / (scrollHeight - window.innerHeight)) * 100;
          bg.style.backgroundPositionY =
            yOffsetPercent >= 100 ? "100%" : `${yOffsetPercent}%`;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        cleanup(() => window.removeEventListener("scroll", onScroll));
      }
    });

    // 背景圖路徑跟隨 Vite base（GitHub Pages 子路徑部署時會是 /blog/background.webp）
    return (
      <div
        class={`parallax-bg ${mode}`}
        ref={bgRef}
        aria-hidden="true"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}background.webp')`,
        }}
      />
    );
  },
);
