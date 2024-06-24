import Link from "next/link";
import { getPropertyDetails } from "@/actions/get-property-details";

import { Badge } from "@dingify/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card";

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {propertyDetails.buildings.map((building) => (
                <Card key={building.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        <Link
                          href={`/property/${propertyId}/building/${building.id}`}
                        >
                          {building.name}
                        </Link>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                      <div className="font-semibold">Detaljer</div>
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Navn</span>
                          <span>{building.name}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Adresse</span>
                          <span>{building.address || "Ingen adresse"}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Type bygg
                          </span>
                          <span>{building.gnr || "Ingen type"}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Størrelse
                          </span>
                          <span>{building.bnr || "Ingen størrelse"} kvm</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      {/* Footer content if needed */}
                    </div>
                  </CardFooter>
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
