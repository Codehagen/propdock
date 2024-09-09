import { getTenantDetails } from "@/actions/get-tenant-details";
import { Button } from "@propdock/ui/components/button";
import { Card } from "@propdock/ui/components/card";
import Link from "next/link";
import React from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ContractCheck } from "@/components/tenant/ContractCheck";

import { TenantDetailsForm } from "./_components/TenantDetailsForm";

export default async function Home({ params }: { params: { id: string } }) {
  const tenantId = params.id;

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
        <DashboardHeader
          heading="Leietaker"
          text="Hvordan leietakeren skal inn i byggningen?"
        />
        {hasContract ? (
          <TenantDetailsForm tenantDetails={tenantDetails} />
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
