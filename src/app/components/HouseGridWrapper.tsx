"use client";

import { useState } from "react";
import HouseGrid from "@/app/components/HouseGrid";

// =======================
// Types
// =======================

type House = {
  id: string;
  title: string;
  images: { src: string }[];
  price: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  [key: string]: any;
};

type Props = {
  houses: House[];
};

// =======================
// Component
// =======================

export default function HouseGridWrapper({ houses }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleHover = (house: House) => {
    setHoveredId(house.id);
    // Optional: log or use this state for map interaction, etc.
  };

  return (
    <HouseGrid
      houses={houses.map((house) => ({
        ...house,
        firestoreId: house.firestoreId || house.id, // Assign default firestoreId if missing
      }))}
      onHover={handleHover}
    />
  );
}
  // Removed redundant code block that redefines housesWithFirestoreId
