import React from "react"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { Card } from "@dingify/ui/components/card"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

import { LandlordDetailsForm } from "./_components/LandlordDetailsForm"

export default async function LandlordContract({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = params.id
  const currentPath = `/tenant/${tenantId}/contract2/landlord`

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (!tenantDetails) {
      return (
        <DashboardShell>
          <DashboardHeader heading="Error" text="Tenant details not found." />
        </DashboardShell>
      )
    }

    if (tenantDetails.name && parseInt(tenantDetails.name) > 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Utleier"
            text="Hvem er utleier på bygget?"
          />
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="help" />
            <EmptyPlaceholder.Title>Du mangler følgende</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Placeholder
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader heading="Utleier" text="Hvem er utleier på bygget?" />
        <LandlordDetailsForm tenantDetails={tenantDetails} />
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
