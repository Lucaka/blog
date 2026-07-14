import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ParallaxBackground } from "~/components/parallax-background/parallax-background";
import { ArchiveContent } from "~/components/archive-content/archive-content";

/** 首頁：滑鼠視差版（取代舊 index.html）。 */
export default component$(() => {
  return (
    <>
      <ParallaxBackground mode="mouse" />
      <ArchiveContent />
    </>
  );
});

export const head: DocumentHead = {
  title: "RUINS // ARCHIVE",
  meta: [
    {
      name: "description",
      content: "STRUCTURAL DECAY — SECTOR 09 // NO HUMAN CONTACT",
    },
  ],
};
