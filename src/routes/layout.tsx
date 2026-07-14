import { component$, Slot } from "@builder.io/qwik";
import { DustCanvas } from "~/components/dust-canvas/dust-canvas";
import { CustomCursor } from "~/components/custom-cursor/custom-cursor";
import { GoToTop } from "~/components/go-to-top/go-to-top";

/**
 * 所有路由共用的版面：金色塵埃、自訂游標、回到頂端按鈕。
 * 視差背景因兩頁模式不同，改由各頁面自行放置。
 */
export default component$(() => {
  return (
    <>
      {/* 前景層：Canvas 金色塵埃 */}
      <DustCanvas />

      {/* 頁面內容（含各自的視差背景） */}
      <Slot />

      {/* 自訂游標 */}
      <CustomCursor />

      {/* 回到頂端按鈕 */}
      <GoToTop />
    </>
  );
});
