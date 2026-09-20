"use client";

import { use, useEffect, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import BoardMembers from "@/components/BoardMembers";

export default function BoardPage({ params }) {
  const { locale } = use(params);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ContentstackClient.getElementByUrl(
        "board_members",
        "/board",
        locale,
      );
      setEntry(data?.[0] ?? null);
    };

    ContentstackClient.onEntryChange(fetchData);
  }, [locale]);

  if (!entry) return null;

  return (
    <div className="pt-8">
      <BoardMembers data={entry} />
    </div>
  );
}
