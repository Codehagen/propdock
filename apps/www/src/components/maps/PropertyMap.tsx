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
import { useMap } from "react-leaflet"

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

const FitBounds = ({ properties }) => {
  const map = useMap()

  useEffect(() => {
    if (map && properties.length > 0) {
      const bounds = properties.map((property) => [
        property.latitude,
        property.longitude,
      ])
      map.fitBounds(bounds)
    }
  }, [map, properties])

  return null
}

export default function PropertyMap() {
  const [L, setL] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const mapRef = useRef<L.Map | null>(null)

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

  const handleSearch = () => {
    const property = properties.find(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (property && mapRef.current) {
      mapRef.current.setView([property.latitude, property.longitude], 16)
    }
  }

  if (!L) {
    return <div>Loading...</div>
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Eiendomskart</CardTitle>
        <CardDescription>Viser plasseringen av eiendommene</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Input
            type="text"
            placeholder="Søk etter eiendomsnavn eller adresse"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Søk
          </Button>
        </div>
        <div className="h-[500px]">
          <MapContainer
            center={[60.472, 8.4689]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              mapRef.current = map
            }}
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
                  <Card>
                    <CardHeader>
                      <CardTitle>{property.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Adresse:</strong> {property.address}
                      </p>
                      {/* Add more property details here if available */}
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
