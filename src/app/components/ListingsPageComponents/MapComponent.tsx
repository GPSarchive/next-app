'use client';

import { useState } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import { House } from '@/app/types/house';

// =======================
// Types
// =======================

type ViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
};

type Props = {
  houses: House[];
  viewState: ViewState;
  selectedHouse: House | null;
  setViewState?: (state: ViewState) => void;
  setSelectedHouse?: (house: House | null) => void;
};

// =======================
// Component
// =======================

const MapComponent = ({
  houses,
  viewState,
  selectedHouse,
  setViewState = () => {},
  setSelectedHouse = () => {},
}: Props) => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        mapStyle="https://tiles.stadiamaps.com/styles/alidade_satellite.json"
        style={{ width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
        onLoad={() => setMapLoaded(true)}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
      >
        <NavigationControl position="top-right" />

        {/* ✅ Markers */}
        {houses.map((house) =>
          house.location?.latitude && house.location?.longitude ? (
            <Marker
              key={house.id}
              longitude={house.location.longitude}
              latitude={house.location.latitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedHouse(house);
              }}
              anchor="bottom"
            >
              <img
                src="/marker.svg"
                alt="Marker"
                className="w-8 h-8 hover:scale-125 transition-transform duration-200 cursor-pointer"
              />
            </Marker>
          ) : null
        )}

        {/* ✅ Styled Popup for selected house */}
        {selectedHouse &&
          selectedHouse.location?.latitude &&
          selectedHouse.location?.longitude && (
            <Popup
              longitude={selectedHouse.location.longitude}
              latitude={selectedHouse.location.latitude}
              closeButton
              closeOnClick={false}
              onClose={() => setSelectedHouse(null)}
              anchor="top"
              className="!p-0 !shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg w-64">
                <div className="relative w-full h-40">
                  <Image
                    src={selectedHouse.images[0]?.src || "/placeholder.jpg"}
                    alt={selectedHouse.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {selectedHouse.title}
                  </h3>
                  <p className="mt-1 text-lg font-bold text-green-600">
                    {selectedHouse.price}
                  </p>
                  {/* Optional: add more details if available */}
                  {selectedHouse.bedrooms && selectedHouse.bathrooms && (
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedHouse.bedrooms} bd • {selectedHouse.bathrooms} ba • {selectedHouse.size} sqft
                    </p>
                  )}
                  <button
                    onClick={() => {
                      // handle navigation or more info
                      window.open(`/houses/${selectedHouse.id}`, '_blank');
                    }}
                    className="mt-4 w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          )}
      </Map>
    </div>
  );
};

export default MapComponent;
