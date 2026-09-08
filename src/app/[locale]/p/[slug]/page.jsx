"use client";

import { use, useEffect, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import ImageBlock from "@/components/ImageBlock";
import RichTextBlock from "@/components/RichTextBlock";
import ColorCalculator from "@/components/ColorCalculator";

const PAGE_REFERENCES = [
  "modular_blocks.color_chart.color_chart",
  "modular_blocks.color_chart.color_chart.rules.male",
  "modular_blocks.color_chart.color_chart.rules.female",
  "modular_blocks.color_chart.color_chart.rules.products.child",
];

export default function Page({ params }) {
  const { locale, slug } = use(params);
  const [entry, setEntry] = useState(null);
  const [geese, setGeese] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [data, gooseEntries] = await Promise.all([
        ContentstackClient.getElementByUrlWithRefs(
          "page",
          `/p/${slug}`,
          locale,
          PAGE_REFERENCES,
          null,
        ),
        ContentstackClient.getElementByType("goose", locale),
      ]);
      setEntry(data?.[0] ?? null);
      setGeese(gooseEntries ?? []);
    };

    ContentstackClient.onEntryChange(fetchData);
  }, [locale, slug]);

  if (!entry) return null;

  return (
    <div className="pt-8">
      {entry.modular_blocks?.map((block, index) => {
        const blockType = Object.keys(block)[0];
        const blockData = block[blockType] ?? {};
        const key = blockData._metadata?.uid ?? index;

        switch (blockType) {
          case "image":
            return <ImageBlock key={key} data={blockData} />;
          case "rich_text":
            return <RichTextBlock key={key} data={blockData} />;
          case "color_chart":
            return (
              <ColorCalculator
                key={key}
                geese={geese}
                rules={blockData.color_chart?.[0]?.rules ?? []}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
