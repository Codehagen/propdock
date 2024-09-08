"use client";

import { generateDefaultAnalysis } from "@/actions/create-default-analysis";
import { Button } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import { Input } from "@propdock/ui/components/input";
import { Separator } from "@propdock/ui/components/separator";
import { Skeleton } from "@propdock/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@propdock/ui/components/tabs";
import {
  Building,
  Calendar,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Search,
  Users,
  Warehouse
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { toast } from "sonner";

import "leaflet/dist/leaflet.css";

import fetchProperties from "@/lib/address-search";

// Dynamic imports for react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), {
  ssr: false
});
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), {
  ssr: false
});

// Updated properties array
const properties = [
  {
    name: "Eiendom A",
    address: "Skipperveien 11a",
    latitude: 67.27230314022967,
    longitude: 14.446854287962129
  },
  {
    name: "Central Atrium",
    address: "Dronningens gate 18",
    latitude: 67.28287603927737,
    longitude: 14.379180886149735
  }
  // Add more properties as needed
];

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: e => {
      onMapClick(e.latlng);
    }
  });
  return null;
};

export default function PropertyMap() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [L, setL] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<L.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [nearbyAddresses, setNearbyAddresses] = useState([]);
  const initialPosition = [67.2802, 14.405]; // Bodø coordinates
  const [orgnr, setOrgnr] = useState("");
  const [mockCompanyData, setMockCompanyData] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState({
    tomtetype: "Selveier tomt",
    tomteareal: "5 268 m²",
    antallBygninger: 1,
    antallBygningstyper: 1,
    bygningstype: "Kjøpesenter",
    byggeaar: 2014,
    bra: "24591 m²"
  });
  const [isPropertyDataLoading, setIsPropertyDataLoading] = useState(false);

  const handleOrgnrSubmit = e => {
    e.preventDefault();
    // Mock data - in a real scenario, this would be fetched from an API
    setMockCompanyData({
      eier: "Eiendom AS",
      inntekter: "5.000.000 NOK",
      kostnader: "3.500.000 NOK",
      antallLeietakere: 12,
      sumDriftsinntekter: "7.500.000 NOK",
      driftsResultat: "2.000.000 NOK",
      resultatForSkatt: "1.800.000 NOK",
      aarsresultat: "1.400.000 NOK",
      sumEiendeler: "25.000.000 NOK"
    });
  };

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet");
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png"
      });
      setL(leaflet);
      setIsLoading(false);
    };
    loadLeaflet();
  }, []);

  const handleMapClick = async latlng => {
    setSelectedLocation(latlng);
    setPropertyData(null);
    setNearbyAddresses([]);
    setIsPropertyDataLoading(true);

    try {
      const response = await fetchNearbyAddresses(latlng.lat, latlng.lng);
      setNearbyAddresses(response.adresser);

      if (response.adresser.length > 0) {
        const nearestAddress = response.adresser[0];
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
          objtype: nearestAddress.objtype
          // Add any other fields you find useful
        });
      }
      setIsPropertyDataLoading(false);
    } catch (error) {
      console.error("Error fetching nearby addresses:", error);
      setIsPropertyDataLoading(false);
    }
  };

  const handlePropertyClick = property => {
    setSelectedLocation({ lat: property.latitude, lng: property.longitude });
    setPropertyData(property);
    mapRef.current?.setView([property.latitude, property.longitude], 15);
  };

  const fetchNearbyAddresses = async (lat, lon) => {
    const radius = 100; // Search radius in meters
    const url = `https://ws.geonorge.no/adresser/v1/punktsok?lat=${lat}&lon=${lon}&radius=${radius}&treffPerSide=5`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const handleCreateAnalysis = async () => {
    if (!propertyData) {
      toast.error("No property selected. Please select a property first.");
      return;
    }

    const analysisData = {
      name: propertyData.name || "Ukjent eiendom",
      rentableArea: propertyDetails.bra
        ? Number.parseInt(propertyDetails.bra.replace(/[^\d]/g, ""))
        : undefined,
      address: propertyData.address,
      gardsnummer: propertyData.gardsnummer,
      bruksnummer: propertyData.bruksnummer,
      kommunenummer: propertyData.kommunenummer,
      kommunenavn: propertyData.kommunenavn,
      sumDriftsinntekter: mockCompanyData?.sumDriftsinntekter
        ? Number.parseFloat(
            mockCompanyData.sumDriftsinntekter.replace(/[^\d.]/g, "")
          )
        : undefined
      // Add any other fields you want to pass from the frontend
    };

    toast.promise(generateDefaultAnalysis(analysisData), {
      loading: "Creating new analysis...",
      success: result => {
        if (result.success) {
          router.push(`/analytics/${result.analysis.id}/dashboard`);
          return `Ny analyse opprettet for ${analysisData.name}`;
        }
        throw new Error(result.error);
      },
      error: err => `Failed to create analysis: ${err.message}`
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-gray-500 text-sm">Laster kart...</p>
        </div>
      </div>
    );
  }

  if (!L) {
    return <div>Loading...</div>;
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
              whenCreated={map => {
                mapRef.current = map;
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
                    click: () => handlePropertyClick(property)
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
                  p =>
                    p.latitude === selectedLocation.lat &&
                    p.longitude === selectedLocation.lng
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
            <CardDescription>
              {selectedLocation
                ? `Valgt lokasjon: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                : "Velg en lokasjon på kartet"}
            </CardDescription>
            {propertyData?.address && (
              <div className="mt-2 flex items-center space-x-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{propertyData.address}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedLocation ? (
              <Tabs defaultValue="property" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="property">Eiendom</TabsTrigger>
                  <TabsTrigger value="company">Selskap</TabsTrigger>
                </TabsList>
                <TabsContent value="property">
                  {isPropertyDataLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ) : propertyData ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5" />
                          <div>
                            <p className="font-semibold">{propertyData.name}</p>
                            <p className="text-gray-500 text-sm">
                              {propertyData.address}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm">Kommune</p>
                            <p>
                              {propertyData.kommunenavn} (
                              {propertyData.kommunenummer})
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Type</p>
                            <p>{propertyData.objtype}</p>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Gårdsnummer</p>
                            <p>{propertyData.gardsnummer}</p>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Bruksnummer</p>
                            <p>{propertyData.bruksnummer}</p>
                          </div>
                          {/* {propertyData.festenummer && (
                            <div>
                              <p className="text-sm font-medium">Festenummer</p>
                              <p>{propertyData.festenummer}</p>
                            </div>
                          )} */}
                          {propertyData.undernummer && (
                            <div>
                              <p className="font-medium text-sm">Undernummer</p>
                              <p>{propertyData.undernummer}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="mb-4 font-semibold">Nøkkelinfo</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Home className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">
                                {propertyDetails.tomtetype}
                              </p>
                              <p>{propertyDetails.tomteareal}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">Bygninger</p>
                              <p>{propertyDetails.antallBygninger}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Warehouse className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">
                                Bygningstyper
                              </p>
                              {/* <p>{propertyDetails.antallBygningstyper}</p> */}
                              <p className="text-gray-500 text-xs">
                                {propertyDetails.bygningstype}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">Byggeår</p>
                              {/* <p>
                                {propertyDetails.antallBygninger} av{" "}
                                {propertyDetails.antallBygninger} bygning
                              </p> */}
                              <p>{propertyDetails.byggeaar}</p>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center space-x-2">
                            <Building className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">
                                BRA Matrikkel
                              </p>
                              {/* <p>
                                {propertyDetails.antallBygninger} av{" "}
                                {propertyDetails.antallBygninger} bygning
                              </p> */}
                              <p>{propertyDetails.bra}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <Button onClick={handleCreateAnalysis} className="w-full">
                        Opprett ny analyse
                      </Button>
                    </div>
                  ) : (
                    <p className="py-4 text-center text-muted-foreground">
                      Velg en lokasjon på kartet for å se eiendomsinformasjon.
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="company">
                  <form onSubmit={handleOrgnrSubmit} className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Organisasjonsnummer"
                        value={orgnr}
                        onChange={e => setOrgnr(e.target.value)}
                      />
                      <Button type="submit">Søk</Button>
                    </div>
                  </form>

                  {mockCompanyData && (
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <p className="font-semibold">{mockCompanyData.eier}</p>
                      </div>
                      <div>
                        <h3 className="mb-4 font-semibold">Nøkkeltall</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">Inntekter</p>
                              <p>{mockCompanyData.inntekter}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">Kostnader</p>
                              <p>{mockCompanyData.kostnader}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">
                                Antall Leietakere
                              </p>
                              <p>{mockCompanyData.antallLeietakere}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-4 font-semibold">
                          Finansiell informasjon
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-sm">
                              Sum driftsinntekter
                            </p>
                            <p>{mockCompanyData.sumDriftsinntekter}</p>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Driftsresultat
                            </p>
                            <p>{mockCompanyData.driftsResultat}</p>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Resultat før skatt
                            </p>
                            <p>{mockCompanyData.resultatForSkatt}</p>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Årsresultat</p>
                            <p>{mockCompanyData.aarsresultat}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-medium text-sm">Sum eiendeler</p>
                            <p>{mockCompanyData.sumEiendeler}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <p className="py-4 text-center">
                Velg en lokasjon på kartet for å se eiendomsinformasjon.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
