import {
  component$,
  useSignal,
  useVisibleTask$,
  useStylesScoped$,
} from "@builder.io/qwik";

/**
 * 金色塵埃 (Golden Dust)：在畫面上緩慢漂浮、閃爍的粒子。
 * 動畫迴圈用 useVisibleTask$ 啟動，並在 cleanup 時取消，避免路由切換後累積迴圈。
 */
export const DustCanvas = component$(() => {
  useStylesScoped$(`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
    }
  `);

  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const particleCount = 120;

    class Particle {
      x = 0;
      y = 0;
      speedY = 0;
      speedX = 0;
      size = 0;
      opacity = 0;
      fadeSpeed = 0;
      fadeDir = 1;

      constructor() {
        this.reset();
        this.y = Math.random() * height; // 初始隨機分佈
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.speedY = Math.random() * 0.3 + 0.05; // 非常緩慢的漂浮
        this.speedX = Math.random() * 0.4 - 0.2;
        this.size = Math.random() * 2.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.fadeDir = 1;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // 閃爍
        this.opacity += this.fadeSpeed * this.fadeDir;
        if (this.opacity >= 0.7 || this.opacity <= 0.05) {
          this.fadeDir *= -1;
        }

        if (this.y < -10 || this.x > width + 10 || this.x < -10) {
          this.reset();
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // 金色
        ctx!.fill();
      }
    }

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let rafId = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      rafId = requestAnimationFrame(animate);
    };

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    init();
    animate();

    cleanup(() => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    });
  });

  return <canvas ref={canvasRef} />;
});
