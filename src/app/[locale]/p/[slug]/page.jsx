"use client";

import { use, useEffect, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import ImageBlock from "@/components/ImageBlock";
import RichTextBlock from "@/components/RichTextBlock";

export default function Page({ params }) {
  const { locale, slug } = use(params);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ContentstackClient.getElementByUrl(
        "page",
        `/p/${slug}`,
        locale,
        null,
      );
      setEntry(data?.[0] ?? null);
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
          default:
            return null;
        }
      })}
    </div>
  );
}
