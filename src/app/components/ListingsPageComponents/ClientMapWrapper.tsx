// app/components/ListingsPageComponents/ClientMapWrapper.tsx
'use client';

import { House } from '@/app/types/house';
import MapWrapper from '@/app/components/ListingsPageComponents/MapWrapper';

export interface ClientMapWrapperProps {
  houses: House[];
  viewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  selectedHouse: House | null;
  setViewState: (vs: {
    latitude: number;
    longitude: number;
    zoom: number;
  }) => void;
  setSelectedHouse: (house: House | null) => void;
}

export default function ClientMapWrapper({
  houses,
  viewState,
  selectedHouse,
  setViewState,
  setSelectedHouse,
}: ClientMapWrapperProps) {
  return (
    <MapWrapper
      houses={houses}
      viewState={viewState}
      selectedHouse={selectedHouse}
      setViewState={setViewState}
      setSelectedHouse={setSelectedHouse}
    />
  );
}
