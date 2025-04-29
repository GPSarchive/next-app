// app/components/ListingsPageComponents/MapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { House } from '@/app/types/house';

const MapComponent = dynamic(
  () => import('@/app/components/ListingsPageComponents/MapComponent'),
  { ssr: false }
);

export type ViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
};

export type MapWrapperProps = {
  houses: House[];
  viewState: ViewState;
  selectedHouse: House | null;
  setViewState: (vs: ViewState) => void;
  setSelectedHouse: (house: House | null) => void;
};

export default function MapWrapper({
  houses,
  viewState,
  selectedHouse,
  setViewState,
  setSelectedHouse,
}: MapWrapperProps) {
  return (
    <MapComponent
      houses={houses}
      viewState={viewState}
      selectedHouse={selectedHouse}
      setViewState={setViewState}
      setSelectedHouse={setSelectedHouse}
    />
  );
}
