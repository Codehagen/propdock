import { getTenantDetails } from "@/actions/get-tenant-details";
import { Button } from "@propdock/ui/components/button";
import Link from "next/link";
import React from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ContractCheck } from "@/components/tenant/ContractCheck";

import { LandlordDetailsForm } from "./_components/LandlordDetailsForm";

export default async function LandlordContract({
  params
}: {
  params: { id: string };
}) {
  const tenantId = params.id;
  const currentPath = `/tenant/${tenantId}/contract/landlord`;

  try {
    const tenantDetails = await getTenantDetails(tenantId);

    if (!tenantDetails) {
      return (
        <DashboardShell>
          <DashboardHeader heading="Error" text="Tenant details not found." />
        </DashboardShell>
      );
    }

    const hasContract =
      tenantDetails.contracts && tenantDetails.contracts.length > 0;

    return (
      <DashboardShell>
        <DashboardHeader heading="Utleier" text="Hvem er utleier på bygget?" />
        {hasContract ? (
          <LandlordDetailsForm tenantDetails={tenantDetails} />
        ) : (
          <ContractCheck tenantDetails={tenantDetails} />
        )}
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
