// src/app/(property)/property/[id]/building/[buildingId]/page.tsx

import { getBuildingDetails } from "@/actions/get-building-details";

import { AddFloorSheet } from "@/components/buttons/AddFloorSheet";
import { AddOfficeSpaceSheet } from "@/components/buttons/AddOfficeSpaceSheet";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import FloorsTable from "@/components/table/floors/floors-table";

export default async function BuildingPage({ params }) {
  const { buildingId } = params;

  if (!buildingId) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Building not found"
          text="Invalid building ID."
        />
      </DashboardShell>
    );
  }

  try {
    const buildingDetails = await getBuildingDetails(buildingId);
    console.log(buildingDetails);

    if (!buildingDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Building not found"
            text="We couldn't find the building you're looking for."
          />
        </DashboardShell>
      );
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={buildingDetails.name}
          text="Building details and management."
        >
          <AddFloorSheet buildingId={buildingId} />
        </DashboardHeader>
        <div>
          {buildingDetails.floors.length === 0 ? (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="building" />
              <EmptyPlaceholder.Title>
                La oss legge til etasjer
              </EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                La oss legge til areal for eiendommen
              </EmptyPlaceholder.Description>
              <AddFloorSheet buildingId={buildingId} />
            </EmptyPlaceholder>
          ) : (
            <FloorsTable floors={buildingDetails.floors} />
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
