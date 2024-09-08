import { getTenantDetails } from "@/actions/get-tenant-details";
import { Card } from "@propdock/ui/components/card";
import React from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ContractCheck } from "@/components/tenant/ContractCheck";

import { SummaryDetailsForm } from "./_components/SummaryDetailsForm";

export default async function SummaryPage({
  params
}: {
  params: { id: string };
}) {
  const tenantId = params.id;

  try {
    const tenantDetails = await getTenantDetails(tenantId);

    const hasContract =
      tenantDetails?.contracts && tenantDetails?.contracts.length > 0;

    return (
      <DashboardShell>
        <DashboardHeader heading="Samendrag" text="Samendrag av leietakeren" />
        {hasContract ? (
          <SummaryDetailsForm tenantDetails={tenantDetails} />
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
