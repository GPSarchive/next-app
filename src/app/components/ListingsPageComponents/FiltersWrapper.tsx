"use client";

import { useState } from "react";
import FiltersBar from "@/app/components/FiltersBar";

// =======================
// Types
// =======================

type Props = {
  resultsCount: number;
};

// =======================
// Component
// =======================

export default function FiltersWrapper({ resultsCount }: Props) {
  const [filter, setFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("default");

  return (
    <FiltersBar
      filter={filter}
      setFilter={setFilter}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      resultsCount={resultsCount}
    />
  );
}
