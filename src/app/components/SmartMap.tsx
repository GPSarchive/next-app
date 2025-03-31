'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MapComponentSSR from './MapComponentSSR';

type House = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  price: string;
  images: Array<{ src: string; alt?: string }>;
};

type ViewState = {
  latitude: number;
  longitude: number;
  zoom: number;
};

type SmartMapProps = {
  houses: House[];
  viewState: ViewState;
  selectedHouse?: House | null;
};

// Lazy load client map
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <p className="text-center text-gray-500">Loading interactive map...</p>
  ),
});

export default function SmartMap({ houses, viewState, selectedHouse = null }: SmartMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <MapComponentSSR houses={houses} viewState={viewState} />;
  }

  return (
    <MapComponent
      houses={houses}
      viewState={viewState}
      selectedHouse={selectedHouse}
    />
  );
}
