import { getPropertyDetails } from "@/actions/get-property-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import Link from "next/link";

import { AddBuildingSheet } from "@/components/buttons/AddBuildingSheet";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const propertyId = params.id;

  if (!propertyId) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Property not found"
          text="Invalid property ID."
        />
      </DashboardShell>
    );
  }

  try {
    const propertyDetails = await getPropertyDetails(propertyId);

    if (!propertyDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Property not found"
            text="We couldn't find the property you're looking for."
          />
        </DashboardShell>
      );
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={propertyDetails.name}
          text="Detaljer om eiendommen."
        >
          <AddBuildingSheet propertyId={propertyId} />
        </DashboardHeader>
        <div>
          {propertyDetails.buildings.length === 0 ? (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="building" />
              <EmptyPlaceholder.Title>Ingen bygg</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                Legg til bygninger som er tilknyttet eiendommen.
              </EmptyPlaceholder.Description>
              <AddBuildingSheet propertyId={propertyId} />
            </EmptyPlaceholder>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {propertyDetails.buildings.map((building) => (
                <Card key={building.id}>
                  <CardHeader className="mb-5 bg-gradient-to-b from-muted/50 to-muted/10">
                    <CardTitle>
                      <Link
                        href={`/property/${propertyId}/building/${building.id}`}
                      >
                        {building.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{building.address}</CardDescription>
                  </CardHeader>
                  <CardContent>Some content</CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    );
  }
}
