import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ParallaxBackground } from "~/components/parallax-background/parallax-background";
import { ArchiveContent } from "~/components/archive-content/archive-content";

/** 捲動視差版（取代舊 index2.html）。 */
export default component$(() => {
  return (
    <>
      <ParallaxBackground mode="scroll" />
      <ArchiveContent />
    </>
  );
});

export const head: DocumentHead = {
  title: "RUINS // ARCHIVE",
  meta: [
    {
      name: "description",
      content:
        "STRUCTURAL DECAY — SECTOR 09 // NO HUMAN CONTACT (scroll parallax)",
    },
  ],
};
