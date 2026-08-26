"use client";

import { use, useEffect, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import Hero from "@/components/Hero";
import QuickLinks from "@/components/QuickLinks";
import TextAndImage from "@/components/TextAndImage";
import ResourceGrid from "@/components/ResourceGrid";

const HOMEPAGE_REFERENCES = [
  "hero_slides.button_1_page",
  "hero_slides.button_2_page",
  "modular_blocks.quick_links.items.page",
  "modular_blocks.text_and_image.page",
  "modular_blocks.resource_grid.cards.page",
  "modular_blocks.resource_grid.cta.button_1_page",
  "modular_blocks.resource_grid.cta.button_2_page",
];

export default function Home({ params }) {
  const { locale } = use(params);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // the homepage entry cached in DataContext (layout.jsx) doesn't have
      // hero_slides'/modular_blocks' page references resolved, so always
      // fetch fresh here.
      const data = await ContentstackClient.getElementByTypeWithRefs(
        "homepage",
        locale,
        HOMEPAGE_REFERENCES,
        null,
      );
      setEntry(data?.[0] ?? null);
    };

    ContentstackClient.onEntryChange(fetchData);
  }, [locale]);

  return (
    <div>
      <Hero slides={entry?.hero_slides ?? []} />
      {entry?.modular_blocks?.map((block, index) => {
        const blockType = Object.keys(block)[0];
        const blockData = block[blockType] ?? {};
        const key = blockData._metadata?.uid ?? index;

        switch (blockType) {
          case "quick_links":
            return <QuickLinks key={key} items={blockData.items ?? []} />;
          case "text_and_image":
            return <TextAndImage key={key} data={blockData} />;
          case "resource_grid":
            return (
              <ResourceGrid key={key} cards={blockData.cards ?? []} cta={blockData.cta} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
