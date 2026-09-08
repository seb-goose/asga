"use client";

import { use, useEffect, useState } from "react";
import { ContentstackClient } from "@/lib/contentstack-client";
import ColorCalculator from "@/components/ColorCalculator";

const CALCULATOR_REFERENCES = ["rules.male", "rules.female", "rules.products.child"];

export default function TestPage({ params }) {
  const { locale } = use(params);
  const [geese, setGeese] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [gooseEntries, calculatorEntries] = await Promise.all([
        ContentstackClient.getElementByType("goose", locale),
        ContentstackClient.getElementByTypeWithRefs(
          "color_calculator",
          locale,
          CALCULATOR_REFERENCES,
        ),
      ]);
      setGeese(gooseEntries ?? []);
      setRules(calculatorEntries?.[0]?.rules ?? []);
    };

    ContentstackClient.onEntryChange(fetchData);
  }, [locale]);

  return (
    <div className="py-10">
      <ColorCalculator geese={geese} rules={rules} />
    </div>
  );
}
