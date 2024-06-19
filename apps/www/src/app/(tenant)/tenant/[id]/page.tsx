import Link from "next/link";
import { getTenantDetails } from "@/actions/get-tenant-details";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default async function TenantDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const tenantId = parseInt(params.id);

  if (isNaN(tenantId)) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Tenant not found" text="Invalid tenant ID." />
      </DashboardShell>
    );
  }

  try {
    const tenantDetails = await getTenantDetails(tenantId);

    if (!tenantDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Tenant not found"
            text="We couldn't find the tenant you're looking for."
          />
        </DashboardShell>
      );
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om leietaker."
        >
          {/* Add any action buttons or sheets here if needed */}
        </DashboardHeader>
        <div>
          <h4>Tenant Details:</h4>
          <ul>
            <li>Name: {tenantDetails.name}</li>
            <li>Organization Number: {tenantDetails.orgnr}</li>
            <li>Number of Employees: {tenantDetails.numEmployees}</li>
            <li>Building: {tenantDetails.building?.name || "N/A"}</li>
            <li>
              Floor: {tenantDetails.floor ? tenantDetails.floor.number : "N/A"}
            </li>
            <li>
              Office Space:{" "}
              {tenantDetails.officeSpace
                ? tenantDetails.officeSpace.name
                : "N/A"}
            </li>
          </ul>
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
