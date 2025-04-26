'use client';

import { useState } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  Source,
  Layer,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { SlLocationPin } from "react-icons/sl";
import Image from "next/image";
import { House } from '@/app/types/house';

// =======================
// Types
// =======================

type Location = {
  latitude: number;
  longitude: number;
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
        mapStyle="https://tiles.stadiamaps.com/styles/alidade_satellite.json??api_key=37c5a6d2-4f8e-4fa6-ab87-717011524156"
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
            >
              <SlLocationPin className="text-red-600 text-3xl hover:scale-125 transition-transform duration-200 cursor-pointer" />
            </Marker>
          ) : null
        )}

        {/* ✅ Popup for selected house */}
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
            >
              <div className="p-0 bg-white shadow-lg rounded-md text-black w-[200px]">
                <Image
                  src={selectedHouse.images[0]?.src || "/placeholder.jpg"}
                  width={200}
                  height={100}
                  alt={selectedHouse.title}
                  className="w-full h-32 object-cover rounded-md"
                />
                <div className="p-2">
                  <h3 className="text-lg font-semibold">{selectedHouse.title}</h3>
                  <p className="text-gray-600">{selectedHouse.price}</p>
                </div>
              </div>
            </Popup>
          )}

        {/* ✅ Custom Raster Layer */}
        {mapLoaded && (
           <Source
                 id="stadiamaps-sat-tiles"
                 type="raster"
                 tiles={[
                   "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg?api_key=37c5a6d2-4f8e-4fa6-ab87-717011524156",
                 ]}
                 tileSize={256}
               >
                 <Layer id="stadiamaps-sat-layer" type="raster" paint={{ "raster-opacity": 1 }} />
               </Source>
        )}

        
      </Map>
    </div>
  );
};

export default MapComponent;
