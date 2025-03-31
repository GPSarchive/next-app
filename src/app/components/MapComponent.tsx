"use client";

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

// =======================
// Types
// =======================

type Location = {
  latitude: number;
  longitude: number;
};

type House = {
  id: string;
  title: string;
  price: string;
  location?: Location;
  images: { src: string }[];
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
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        attributionControl={{ compact: true }}
        onLoad={() => setMapLoaded(true)}
        style={{ width: "100%", height: "100%" }}
        mapStyle='/alidade_smooth_custom.json'
      >
        <NavigationControl position="top-right" />

        {/* ✅ House Markers */}
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

        {/* ✅ Popup */}
        {selectedHouse &&
          selectedHouse.location?.latitude &&
          selectedHouse.location?.longitude && (
            <Popup
              longitude={selectedHouse.location.longitude}
              latitude={selectedHouse.location.latitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setSelectedHouse(null)}
              anchor="top"
            >
              <div className="p-0 bg-white shadow-lg rounded-md text-black w-50">
                <Image
                  src={selectedHouse.images[0]?.src || "/placeholder.jpg"}
                  width={200}
                  height={100}
                  alt={selectedHouse.title}
                  className="w-50 h-32 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-2">{selectedHouse.title}</h3>
                <p className="text-gray-600">{selectedHouse.price}</p>
              </div>
            </Popup>
          )}

        {/* ✅ Tile Layer */}
        {mapLoaded && (
          <Source
            id="stadiamaps-tiles"
            type="raster"
            tiles={[
              "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=f7f2bfb3-a0a2-4cb3-8639-6bb622864439",
            ]}
            tileSize={256}
          >
            <Layer id="stadiamaps-layer" type="raster" />
          </Source>
        )}

        {/* ✅ 3D Buildings Layer */}
        {mapLoaded && (
          <Source
            id="maptiler-buildings"
            type="vector"
            tiles={[
              "https://api.maptiler.com/tiles/3d-buildings/{z}/{x}/{y}.pbf?key=hEibyRgEwQNk9pgczY75",
            ]}
          >
            <Layer
              id="3d-buildings"
              source="mapbox-buildings"
              source-layer="building"
              type="fill-extrusion"
              minzoom={15}
              paint={{
                "fill-extrusion-color": "#aaa",
                "fill-extrusion-height": ["get", "height"],
                "fill-extrusion-base": ["get", "min_height"],
                "fill-extrusion-opacity": 0.6,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
