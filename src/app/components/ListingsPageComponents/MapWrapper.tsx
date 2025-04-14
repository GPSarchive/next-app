'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { House } from '@/app/types/house';

const MapComponent = dynamic(() => import('@/app/components/ListingsPageComponents/MapComponent'), {
  ssr: false,
});

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
      setSelectedHouse={(house) => setSelectedHouse(house)} // ✅ key line
    />
  );
}
