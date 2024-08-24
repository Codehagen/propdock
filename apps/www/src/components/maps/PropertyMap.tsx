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

import fetchProperties from "@/lib/address-search"

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
  const [nearbyAddresses, setNearbyAddresses] = useState([])
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
    setNearbyAddresses([])

    try {
      const response = await fetchNearbyAddresses(latlng.lat, latlng.lng)
      setNearbyAddresses(response.adresser)

      if (response.adresser.length > 0) {
        const nearestAddress = response.adresser[0]
        setPropertyData({
          name: nearestAddress.adressetekst,
          address: `${nearestAddress.adressetekst}, ${nearestAddress.postnummer} ${nearestAddress.poststed}`,
          latitude: nearestAddress.representasjonspunkt.lat,
          longitude: nearestAddress.representasjonspunkt.lon,
          kommunenummer: nearestAddress.kommunenummer,
          kommunenavn: nearestAddress.kommunenavn,
          gardsnummer: nearestAddress.gardsnummer,
          bruksnummer: nearestAddress.bruksnummer,
          festenummer: nearestAddress.festenummer,
          undernummer: nearestAddress.undernummer,
          objtype: nearestAddress.objtype,
          // Add any other fields you find useful
        })
      }
    } catch (error) {
      console.error("Error fetching nearby addresses:", error)
    }
  }

  const handlePropertyClick = (property) => {
    setSelectedLocation({ lat: property.latitude, lng: property.longitude })
    setPropertyData(property)
    mapRef.current?.setView([property.latitude, property.longitude], 15)
  }

  const fetchNearbyAddresses = async (lat, lon) => {
    const radius = 100 // Search radius in meters
    const url = `https://ws.geonorge.no/adresser/v1/punktsok?lat=${lat}&lon=${lon}&radius=${radius}&treffPerSide=5`
    const response = await fetch(url)
    const data = await response.json()
    return data
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
        <Card className="h-full overflow-auto">
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
                      <strong>Navn:</strong> {propertyData.name}
                    </p>
                    <p>
                      <strong>Adresse:</strong> {propertyData.address}
                    </p>
                    <p>
                      <strong>Kommune:</strong> {propertyData.kommunenavn} (
                      {propertyData.kommunenummer})
                    </p>
                    <p>
                      <strong>Gårdsnummer:</strong> {propertyData.gardsnummer}
                    </p>
                    <p>
                      <strong>Bruksnummer:</strong> {propertyData.bruksnummer}
                    </p>
                    {propertyData.festenummer && (
                      <p>
                        <strong>Festenummer:</strong> {propertyData.festenummer}
                      </p>
                    )}
                    {propertyData.undernummer && (
                      <p>
                        <strong>Undernummer:</strong> {propertyData.undernummer}
                      </p>
                    )}
                    <p>
                      <strong>Type:</strong> {propertyData.objtype}
                    </p>
                    <Button className="mt-4 w-full">Vurder eiendom</Button>
                  </div>
                ) : (
                  <p className="mt-4">Søker etter eiendomsdata...</p>
                )}
                {nearbyAddresses.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold">Nærliggende adresser:</h3>
                    <ul className="mt-2 list-disc pl-5">
                      {nearbyAddresses.map((address, index) => (
                        <li key={index}>{address.adressetekst}</li>
                      ))}
                    </ul>
                  </div>
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
