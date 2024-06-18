import Link from "next/link";
import { getPropertyDetails } from "@/actions/get-property-details";

import { AddBuildingButton } from "@/components/buttons/AddBuildingButton";
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
              <EmptyPlaceholder.Title>
                Legg til bygninger på eiendommen
              </EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                Legg til hvordan bygninger som er tilknyttet eiendommen.
              </EmptyPlaceholder.Description>
              <AddBuildingButton propertyId={propertyId} />
            </EmptyPlaceholder>
          ) : (
            <div>
              <h4>Buildings:</h4>
              <ul>
                {propertyDetails.buildings.map((building) => (
                  <li key={building.id}>
                    <Link
                      href={`/property/${propertyId}/building/${building.id}`}
                    >
                      {building.name}
                    </Link>
                  </li>
                ))}
              </ul>
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
