// src/app/components/DetailsPageComponents/DetailsMap.tsx
'use client';

import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';

interface DetailsMapProps {
  location: {
    latitude: number | string;
    longitude: number | string;
  };
  title: string;
}

export default function DetailsMap({
  location: { latitude, longitude },
  title,
}: DetailsMapProps) {
  // coerce to numbers & guard
  const lat = useMemo(() => Number(latitude), [latitude]);
  const lng = useMemo(() => Number(longitude), [longitude]);

  if (isNaN(lat) || isNaN(lng)) {
    console.error('DetailsMap: Invalid lat/lng:', latitude, longitude);
    return (
      <div className="w-full h-full flex items-center justify-center">
        Invalid location
      </div>
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div className="w-full h-full relative rounded border-[1.5px] border-black overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat, lng }}
        zoom={12}
        options={{
          mapTypeId: 'hybrid',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        <Marker
          position={{ lat, lng }}
          title={title}
          icon={{
            url: '/marker.svg',                     // your custom SVG in /public
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          }}
        />
      </GoogleMap>

      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 bg-white bg-opacity-50 hover:bg-opacity-75 text-black text-sm font-medium px-3 py-1 rounded shadow transition"
      >
        View on maps
      </a>
    </div>
  );
}
