export interface Article {
  /** 卡片左上角的標籤 */
  category: string;
  /** 卡片右上角的標籤 */
  tag: string;
  title: string;
  body: string;
  /** 底部連結文字 */
  linkLabel: string;
  href: string;
}

export const articles: Article[] = [
  {
    category: "Log_892",
    tag: "10:00 AM",
    title: "The Great Hall",
    body: "The roof has completely collapsed. Light pours in like a physical substance, illuminating the dust motes dancing in the stagnant air. It is quiet, but heavy.",
    linkLabel: "READ_ENTRY",
    href: "#",
  },
  {
    category: "Observation",
    tag: "Flora",
    title: "Concrete Roots",
    body: "We found trees growing directly out of the reinforced pillars. The roots are breaking the stone apart, slowly reclaiming the architecture.",
    linkLabel: "VIEW_IMAGES",
    href: "#",
  },
  {
    category: "Audio_File",
    tag: "Corrupted",
    title: "Echoes of Industry",
    body: "Wind passing through the broken windows creates a whistling sound, almost like the machines are trying to start up again.",
    linkLabel: "PLAY_AUDIO",
    href: "#",
  },
  {
    category: "Status",
    tag: "Stable",
    title: "Light Pollution",
    body: "There is no electricity, yet the moss in the basement emits a faint bioluminescence. Nature is creating its own power grid.",
    linkLabel: "ANALYZE",
    href: "#",
  },
  {
    category: "Archive",
    tag: "0% Decay",
    title: "The Vault",
    body: "Deep beneath the rubble, the airlock remains sealed. What lies inside has not seen the sun for two centuries.",
    linkLabel: "ACCESS_DENIED",
    href: "#",
  },
];
