'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';
import { House } from '@/app/types/house';

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
};

type Props = {
  houses: House[];
  viewState: ViewState;
  selectedHouse: House | null;
  setViewState?: (state: ViewState) => void;
  setSelectedHouse?: (house: House | null) => void;
};

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const libraries = ['places'] as const;

const MapComponent = ({
  houses,
  viewState,
  selectedHouse,
  setViewState = () => {},
  setSelectedHouse = () => {},
}: Props) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: [...libraries],
  });

  // Keep a ref to the map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  // Store map instance on load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Clear ref on unmount
  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Smoothly pan map when a house is selected
  useEffect(() => {
    if (selectedHouse && mapRef.current) {
      const lat = Number(selectedHouse.location.latitude);
      const lng = Number(selectedHouse.location.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapRef.current.panTo({ lat, lng });
      }
    }
  }, [selectedHouse]);

  // After any pan/zoom, sync React state
  const onIdle = useCallback(() => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    const zoom = mapRef.current.getZoom();
    if (center && typeof zoom === 'number') {
      setViewState({
        latitude: center.lat(),
        longitude: center.lng(),
        zoom,
      });
    }
  }, [setViewState]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={{ lat: viewState.latitude, lng: viewState.longitude }}
        zoom={viewState.zoom}
        options={{ mapTypeId: 'hybrid', streetViewControl: false, mapTypeControl: false, fullscreenControl: false, zoomControl: true }}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onIdle={onIdle}
      >
        {houses.map((house) => {
          const lat = Number(house.location?.latitude);
          const lng = Number(house.location?.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={house.id}
              position={{ lat, lng }}
              onClick={() => setSelectedHouse(house)}
              icon={{
                url: '/marker.svg',
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
              }}
            />
          );
        })}

        {selectedHouse && (() => {
          const lat = Number(selectedHouse.location.latitude);
          const lng = Number(selectedHouse.location.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <InfoWindow position={{ lat, lng }} onCloseClick={() => setSelectedHouse(null)}>
              <>
                <div className="w-64 fade-in-popup">
                  <div className="relative w-full h-40">
                    <Image
                      src={selectedHouse.images[0]?.src || '/placeholder.jpg'}
                      alt={selectedHouse.title}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="p-4 bg-white rounded-b-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {selectedHouse.title}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-green-600">
                      {selectedHouse.price}
                    </p>
                    {selectedHouse.bedrooms != null &&
                       selectedHouse.bathrooms != null && (
                      <p className="mt-2 text-sm text-gray-600">
                        {selectedHouse.bedrooms} bd • {selectedHouse.bathrooms} ba •{' '}
                        {selectedHouse.size} sqft
                      </p>
                    )}
                    <button
                      onClick={() => window.open(`/houses/${selectedHouse.id}`, '_blank')}
                      className="mt-4 w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <style jsx>{`
                  .fade-in-popup {
                    animation: fadeIn 1s ease-out;
                  }
                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                      transform: scale(0.95);
                    }
                    to {
                      opacity: 1;
                      transform: scale(1);
                    }
                  }
                `}</style>
              </>
            </InfoWindow>
          );
        })()}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;