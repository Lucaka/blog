# Qwik 框架遷移規劃

> 目標：將現有的 Express + 靜態 HTML 部落格改寫為 [Qwik](https://qwik.dev/) 應用程式。
> 撰寫日期：2026-07-13

## 1. 現況盤點

| 項目 | 現況 |
|---|---|
| 伺服器 | `index.js` — Express 5，僅做靜態檔案服務（`/` 與 `/index2` 兩條路由） |
| 頁面 | `index.html`（滑鼠視差版）、`index2.html`（捲動視差版），兩者 95% 相同 |
| 樣式 | 全部內嵌在各 HTML 的 `<style>` 中，兩份幾乎重複 |
| 互動 JS | 內嵌 `<script>`：金色塵埃 Canvas 粒子、視差背景、自訂游標、GoToTop |
| 內容 | 5 張文章卡片硬寫在 HTML 裡（RUINS // ARCHIVE 主題） |
| 資產 | `public/background.png`（**6.8 MB**，偏大）、Google Fonts（Cormorant Garamond、Space Mono） |
| 工具鏈 | pnpm，無建置流程、無 TypeScript、無測試 |

兩個頁面唯一的差異是視差背景的驅動方式（滑鼠 vs. 捲動）與少量 CSS，非常適合抽成同一個元件的兩種模式。

## 2. 版本選擇

採用 **Qwik 1.x（穩定版，目前 1.20.0）+ Qwik City**。

Qwik 2.0 目前仍在 beta（2.0.0-beta.37，2026-06），API 尚未凍結，不建議正式專案採用。1.x 到 2.0 官方會提供遷移路徑，屆時再升級即可。

## 3. 目標架構

以 `pnpm create qwik@latest` 建立 Qwik City 專案（TypeScript），結構如下：

```
blog/
├── public/
│   └── background.webp          # 由 background.png 壓縮轉檔而來
├── src/
│   ├── components/
│   │   ├── parallax-background/ # 視差背景（props 切換 mouse / scroll 模式）
│   │   ├── dust-canvas/         # 金色塵埃 Canvas 粒子
│   │   ├── custom-cursor/       # 自訂游標（dot + ring）
│   │   ├── go-to-top/           # 回到頂端按鈕
│   │   ├── hero/                # STRUCTURAL DECAY 大標題
│   │   ├── article-card/        # 文章卡片
│   │   └── footer/              # END OF TRANSMISSION 頁尾
│   ├── data/
│   │   └── articles.ts          # 卡片內容抽成資料（未來可換成 markdown/CMS）
│   ├── routes/
│   │   ├── layout.tsx           # 共用版面：背景、塵埃、游標、GoToTop
│   │   ├── index.tsx            # 首頁（滑鼠視差，取代 index.html）
│   │   └── index2/
│   │       └── index.tsx        # 捲動視差版（取代 index2.html）
│   ├── global.css               # 共用樣式（配色變數、基礎設定、字體）
│   └── root.tsx                 # <head>：Google Fonts、meta、lang="zh-TW"
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**Express 完全移除**：開發用 Vite dev server，部署視需求選 adapter —

- 純靜態內容（現況）→ `static adapter`（SSG，可丟 GitHub Pages / Netlify / Cloudflare Pages）
- 未來需要後端 API → `express adapter` 或 `node-server adapter`

現階段建議 **static adapter（SSG）**，最簡單也最快。

## 4. 元件拆解與 Qwik API 對應

| 現有功能 | Qwik 實作方式 |
|---|---|
| 金色塵埃 Canvas（`requestAnimationFrame` 迴圈） | `<DustCanvas>` 元件，用 `useVisibleTask$` 啟動動畫迴圈，`cleanup()` 中 `cancelAnimationFrame`；resize 用 `useOnWindow('resize', $(...))` |
| 滑鼠視差（`mousemove` + lerp 阻尼） | `<ParallaxBackground mode="mouse">`，`useOnDocument('mousemove', $(...))` 更新目標值，`useVisibleTask$` 跑 lerp 動畫迴圈 |
| 捲動視差（`scroll` 更新 backgroundPositionY） | 同一元件 `mode="scroll"`，`useOnWindow('scroll', $(...))` |
| 自訂游標（dot + ring、hover 放大） | `<CustomCursor>`，`useOnDocument('mousemove')` 跟隨；hover 放大改為監聽 `mouseover`/`mouseout` 事件委派（避免逐一綁定 `querySelectorAll`，也對動態內容更穩） |
| GoToTop | `<GoToTop>`，`onClick$={() => window.scrollTo({ top: 0, behavior: 'smooth' })}` |
| 文章卡片 × 5 | `articles.ts` 匯出陣列，頁面中 `articles.map(a => <ArticleCard {...a} />)` |
| 內嵌 CSS | 共用部分進 `global.css`；元件專屬樣式用 `useStylesScoped$` 或 CSS Modules |
| Google Fonts | `root.tsx` 的 `<head>` 保留 `<link>`（或改自架字型檔以減少外部請求） |

Qwik 重點觀念：

- **Resumability**：Qwik 不做 hydration，事件處理器（`$` 結尾的 API）會被拆成 lazy chunk，互動時才下載。首屏 JS 幾乎為零，很適合這種「視覺效果為主」的頁面。
- `useVisibleTask$` 會讓程式碼在元件進入視口時立刻在瀏覽器執行，是「逃生艙」，只用在真正需要持續動畫迴圈的地方（塵埃、視差 lerp）；其餘互動一律用 `useOnWindow` / `useOnDocument` / `onClick$` 保持惰性。
- 狀態用 `useSignal` / `useStore`；動畫迴圈裡的高頻數值（粒子座標、lerp 目前值）**不要**放 signal，直接用區域變數操作 DOM/Canvas，避免不必要的反應式開銷。

## 5. 遷移步驟

### Phase 0 — 準備
1. 壓縮 `background.png`：轉 WebP（品質 ~80）預估可從 6.8 MB 降到 <500 KB；同時準備行動版較小尺寸（`<picture>` 或 `image-set`）。
2. 確認 Node 版本 ≥ 18（Qwik 需求）。

### Phase 1 — 建立骨架
3. 在 repo 內以 `pnpm create qwik@latest`（empty/basic starter）初始化，合併 `package.json`。
4. 移除 Express 依賴與 `index.js`；`start` script 改為 `vite`／`preview`。
5. 設定 `root.tsx`（`lang="zh-TW"`、title、Google Fonts）、`global.css`（搬入 `:root` 配色變數與基礎樣式）。

### Phase 2 — 元件化
6. 建立 `articles.ts` 資料檔（5 篇卡片的 meta/title/body/link）。
7. 依序實作元件：`Hero` → `ArticleCard` → `Footer`（純靜態，先驗證 SSR 輸出）。
8. 實作互動元件：`DustCanvas` → `ParallaxBackground`（兩種模式） → `CustomCursor` → `GoToTop`。
9. 組出 `routes/layout.tsx` 與兩個頁面路由，對照原頁面逐一驗證視覺與行為。

### Phase 3 — 收尾
10. 加上 `static adapter`，`pnpm build` 產出 SSG 靜態站。
11. 補基本檢查：`tsc --noEmit`、ESLint（starter 內建 qwik plugin）、`pnpm preview` 手動驗證兩條路由。
12. 更新 `README.md`（開發/建置/部署指令），刪除舊的 `index.html` / `index2.html`。

## 6. 風險與注意事項

- **SSR 與瀏覽器 API**：所有 `window` / `document` / canvas 操作必須包在 `useVisibleTask$` 或事件處理器內，SSR 階段碰不到 DOM。
- **`cursor: none` 的體驗**：自訂游標在 JS chunk 載入前的短暫空窗，游標會完全不可見。建議改為「預設顯示系統游標，`CustomCursor` 掛載後才在 `<body>` 加上 class 隱藏」。這也順帶修掉原本觸控裝置看不到游標的問題（原 CSS 只在 768px 以下隱藏假游標，卻對所有裝置設了 `cursor: none`）。
- **動畫迴圈清理**：原始碼的 `requestAnimationFrame` 迴圈從不停止；Qwik 元件卸載（SPA 導航）時必須在 task cleanup 取消，否則路由切換會累積迴圈。
- **原始碼小 bug 順手修**：`index2.html` 的 cursor ring `mouseleave` 沒有把 borderColor 還原成白色（還原成了 rust 色）；游標 ring 用 `setTimeout` 延遲 80ms 的寫法在快速移動時會排隊堆積，改用 lerp 跟隨較穩。
- **`/index2` 的去留**：兩頁只差視差模式，建議遷移後決定保留哪一種，或做成同一頁的切換選項；若確定只留一種，可省掉一條路由。
- **Qwik 2.0**：等正式版釋出後再依官方 migration guide 升級（主要是套件更名 `@builder.io/qwik` → `@qwik.dev/core`）。

## 7. 驗收標準

- `/` 與 `/index2` 視覺與互動行為與現況一致（塵埃、視差、游標、GoToTop、RWD）。
- `pnpm build` 成功產出靜態站，`pnpm preview` 可正常瀏覽。
- Lighthouse Performance ≥ 95（拜 resumability + 圖片壓縮所賜，應遠優於現況）。
- 無 TypeScript / ESLint 錯誤。
