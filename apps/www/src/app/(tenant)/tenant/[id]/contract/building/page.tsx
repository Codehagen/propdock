import React from "react"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ContractCheck } from "@/components/tenant/ContractCheck"

import { BuildingFormContract } from "./_components/BuildingFormContract"

export default async function Home({ params }: { params: { id: string } }) {
  const tenantId = params.id

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (!tenantDetails) {
      return (
        <DashboardShell>
          <DashboardHeader heading="Error" text="Tenant details not found." />
        </DashboardShell>
      )
    }

    const hasContract =
      tenantDetails.contracts && tenantDetails.contracts.length > 0

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Byggninger"
          text="Hvordan byggning skal leietakeren inn i?"
        />
        {hasContract ? (
          <BuildingFormContract tenantDetails={tenantDetails} />
        ) : (
          <ContractCheck tenantDetails={tenantDetails} />
        )}
      </DashboardShell>
    )
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    )
  }
}
