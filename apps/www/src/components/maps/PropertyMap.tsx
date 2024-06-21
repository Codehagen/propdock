"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card";

import "leaflet/dist/leaflet.css";

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const properties = [
  {
    name: "Eiendom A",
    address: "Skipperveien 11a",
    latitude: 67.27230314022967,
    longitude: 14.446854287962129,
  },
  {
    name: "Central Atrium",
    address: "Dronningens gate 18",
    latitude: 67.28287603927737,
    longitude: 14.379180886149735,
  },
  // Add more properties as needed
];

const FitBounds = ({ properties }) => {
  const map = useMap();

  useEffect(() => {
    if (map && properties.length > 0) {
      const bounds = properties.map((property) => [
        property.latitude,
        property.longitude,
      ]);
      map.fitBounds(bounds);
    }
  }, [map, properties]);

  return null;
};

export default function PropertyMap() {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet");

      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      setL(leaflet);
    };

    loadLeaflet();
  }, []);

  if (!L) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eiendomskart</CardTitle>
        <CardDescription>Viser plasseringen av eiendommene</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <MapContainer
            center={[60.472, 8.4689]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <FitBounds properties={properties} />
            {properties.map((property, index) => (
              <Marker
                key={index}
                position={[property.latitude, property.longitude]}
              >
                <Popup>
                  <strong>{property.name}</strong>
                  <br />
                  {property.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
