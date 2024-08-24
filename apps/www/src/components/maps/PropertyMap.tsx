"use client"

import React, { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import { Input } from "@propdock/ui/components/input"
import { Search } from "lucide-react"
import { useMap, useMapEvents } from "react-leaflet"

import "leaflet/dist/leaflet.css"

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
)
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
})

// Updated properties array
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
]

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    },
  })
  return null
}

export default function PropertyMap() {
  const [L, setL] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const mapRef = useRef<L.Map | null>(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [propertyData, setPropertyData] = useState(null)
  const initialPosition = [67.2802, 14.405] // Bodø coordinates

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet")
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
      })
      setL(leaflet)
    }
    loadLeaflet()
  }, [])

  const handleMapClick = async (latlng) => {
    setSelectedLocation(latlng)
    setPropertyData(null)
    try {
      const response = await fetchPropertyData(latlng.lat, latlng.lng)
      setPropertyData(response)
    } catch (error) {
      console.error("Error fetching property data:", error)
    }
  }

  const handlePropertyClick = (property) => {
    setSelectedLocation({ lat: property.latitude, lng: property.longitude })
    setPropertyData(property)
    mapRef.current?.setView([property.latitude, property.longitude], 15)
  }

  const fetchPropertyData = async (lat, lng) => {
    // Replace this with your actual API call
    console.log(`Searching for property at ${lat}, ${lng}`)
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            address: "Sample Address",
            propertyType: "Residential",
          }),
        1000,
      ),
    )
  }

  if (!L) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      <div className="w-2/3 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Eiendomskart</CardTitle>
            <CardDescription>
              Klikk på kartet eller en markør for å velge en eiendom
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)]">
            <MapContainer
              center={initialPosition}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(map) => {
                mapRef.current = map
              }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <MapClickHandler onMapClick={handleMapClick} />
              {properties.map((property, index) => (
                <Marker
                  key={index}
                  position={[property.latitude, property.longitude]}
                  eventHandlers={{
                    click: () => handlePropertyClick(property),
                  }}
                >
                  <Popup>
                    <Card>
                      <CardHeader>
                        <CardTitle>{property.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          <strong>Adresse:</strong> {property.address}
                        </p>
                        <Button
                          className="mt-2"
                          onClick={() => handlePropertyClick(property)}
                        >
                          Velg eiendom
                        </Button>
                      </CardContent>
                    </Card>
                  </Popup>
                </Marker>
              ))}
              {selectedLocation &&
                !properties.find(
                  (p) =>
                    p.latitude === selectedLocation.lat &&
                    p.longitude === selectedLocation.lng,
                ) && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                  >
                    <Popup>
                      <Card>
                        <CardHeader>
                          <CardTitle>Valgt lokasjon</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>
                            <strong>Latitude:</strong>{" "}
                            {selectedLocation.lat.toFixed(6)}
                          </p>
                          <p>
                            <strong>Longitude:</strong>{" "}
                            {selectedLocation.lng.toFixed(6)}
                          </p>
                        </CardContent>
                      </Card>
                    </Popup>
                  </Marker>
                )}
            </MapContainer>
          </CardContent>
        </Card>
      </div>
      <div className="w-1/3 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Eiendomsinformasjon</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedLocation ? (
              <>
                <p className="mb-2">
                  <strong>Koordinater:</strong>
                </p>
                <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
                <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
                {propertyData ? (
                  <div className="mt-4">
                    <p>
                      <strong>Navn:</strong> {propertyData.name || "N/A"}
                    </p>
                    <p>
                      <strong>Adresse:</strong> {propertyData.address}
                    </p>
                    <Button className="mt-4 w-full">Vurder eiendom</Button>
                  </div>
                ) : (
                  <p className="mt-4">Søker etter eiendomsdata...</p>
                )}
              </>
            ) : (
              <p>Velg en lokasjon på kartet for å se eiendomsinformasjon.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
