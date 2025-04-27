'use client';

import { useState } from 'react';
import Map, {
  Marker,
  NavigationControl,
  Source,
  Layer,
  type ViewState
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SlLocationPin } from 'react-icons/sl';

interface DetailsMapProps {
  location: {
    latitude: number;
    longitude: number;
  };
  title: string;
}

export default function DetailsMap({
  location: { latitude, longitude },
}: DetailsMapProps) {
  // Now including padding (number or PaddingOptions) in the type
  const [viewState, setViewState] = useState<ViewState>({
    latitude,
    longitude,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div className="w-full h-full relative rounded border-[1.5px] border-black overflow-hidden">
      <Map
        initialViewState={viewState}              // ← Partial<ViewState> is fine here
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        // **Use the exact same Stadia satellite style URL**
        mapStyle="https://tiles.stadiamaps.com/styles/alidade_satellite.json??api_key=37c5a6d2-4f8e-4fa6-ab87-717011524156"
        attributionControl={{ compact: true }}
        onLoad={() => setMapLoaded(true)}
      >
        <NavigationControl position="top-right" />

        {/* Property marker */}
        {latitude != null && longitude != null && (
          <Marker longitude={longitude} latitude={latitude}>
            <SlLocationPin className="text-red-600 text-3xl" />
          </Marker>
        )}

        {/* (Optional) If you still want to manually add the raster tiles
            instead of relying on the style's built-in source, you can
            reuse exactly the same Source + Layer: */}
        
      </Map>

      {/* View on Maps button */}
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 bg-white bg-opacity-50 hover:bg-opacity-75 text-black text-sm font-medium px-3 py-1 rounded shadow transition"
      >
        View on maps
      </a>
    </div>
  );
}
