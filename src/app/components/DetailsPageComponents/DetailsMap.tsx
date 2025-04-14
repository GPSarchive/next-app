// src/app/components/DetailsPageComponents/DetailsMap.js
'use client';

import { useState } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SlLocationPin } from 'react-icons/sl';

interface DetailsMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export default function DetailsMap({ latitude, longitude, title }: DetailsMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const viewState = {
    latitude,
    longitude,
    zoom: 12,
  };

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        attributionControl={{ compact: true }}
        onLoad={() => setMapLoaded(true)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="/alidade_smooth_custom.json"
      >
        <NavigationControl position="top-right" />

        {/* Single non-interactive marker */}
        {latitude != null && longitude != null && (
          <Marker longitude={longitude} latitude={latitude}>
            <SlLocationPin className="text-red-600 text-3xl" />
          </Marker>
        )}

        {/* Tile Layer */}
        {mapLoaded && (
          <Source
            id="stadiamaps-tiles"
            type="raster"
            tiles={[
              'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=f7f2bfb3-a0a2-4cb3-8639-6bb622864439',
            ]}
            tileSize={256}
          >
            <Layer id="stadiamaps-layer" type="raster" />
          </Source>
        )}

        {/* 3D Buildings Layer */}
        {mapLoaded && (
          <Source
            id="maptiler-buildings"
            type="vector"
            tiles={[
              'https://api.maptiler.com/tiles/3d-buildings/{z}/{x}/{y}.pbf?key=hEibyRgEwQNk9pgczY75',
            ]}
          >
            <Layer
              id="3d-buildings"
              source="mapbox-buildings"
              source-layer="building"
              type="fill-extrusion"
              minzoom={15}
              paint={{
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.6,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}