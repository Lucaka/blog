# RUINS // ARCHIVE

一個以 [Qwik](https://qwik.dev/) + Qwik City 打造的視覺型部落格（STRUCTURAL DECAY 廢墟主題）。

原本是 Express + 靜態 HTML，現已改寫為 Qwik 應用，並以 **static adapter（SSG）** 產出純靜態網站。改寫規劃見 [`docs/qwik-migration-plan.md`](docs/qwik-migration-plan.md)。

## 開發

```bash
pnpm install
pnpm dev          # Vite dev server（SSR 模式），預設 http://localhost:5173
```

## 建置與預覽

```bash
pnpm build        # 依序執行 typecheck、client build、static SSG、lint
```

建置產物在 `dist/`，為可直接部署的靜態檔案，適合放到 GitHub Pages、Netlify、Cloudflare Pages 等靜態主機。

## 其他指令

```bash
pnpm lint         # ESLint（含 qwik 規則）
pnpm fmt          # Prettier 格式化
pnpm build.types  # 只做 TypeScript 型別檢查
```

## 路由

| 路徑      | 說明                |
| --------- | ------------------- |
| `/`       | 首頁 — 滑鼠視差背景 |
| `/index2` | 捲動視差背景版      |

## 專案結構

```
src/
├── components/     # Hero、ArticleCard、Footer、DustCanvas、
│                   # ParallaxBackground、CustomCursor、GoToTop
├── data/           # articles.ts — 文章卡片內容
├── routes/         # layout.tsx + 兩個頁面路由
├── global.css      # 共用設計 token 與基礎樣式
└── root.tsx        # document <head>（字型、meta）
```

## 備註

- 背景圖已由 6.5 MB PNG 壓成 ~450 KB 的 `public/background.webp`。
- 目前採用 Qwik 1.x 穩定版；待 Qwik 2.0 正式釋出後再依官方指南升級。
