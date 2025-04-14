"use client";

import { useState } from "react";
import MapComponent from "@/app/components/ListingsPageComponents/MapComponent";

// =======================
// Types
// =======================

type House = {
  id: string;
  title: string;
  price: string;
  images: { src: string }[];
  location?: {
    latitude: number;
    longitude: number;
  };
  [key: string]: any;
};

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
};

type Props = {
  houses: House[];
};

// =======================
// Component
// =======================

export default function MapWrapper({ houses }: Props) {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 20.863419,
    latitude: 37.731964,
    zoom: 12,
  });

  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  return (
    <MapComponent
      viewState={viewState}
      setViewState={setViewState}
      houses={houses}
      selectedHouse={selectedHouse}
      setSelectedHouse={setSelectedHouse}
    />
  );
}
