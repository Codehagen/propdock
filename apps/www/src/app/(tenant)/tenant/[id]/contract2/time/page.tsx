import React from "react"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { Card } from "@dingify/ui/components/card"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

import { TimeDetailsForm } from "./_components/TimeDetailsForm"

export default async function TimeContract({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = params.id

  try {
    const tenantDetails = await getTenantDetails(tenantId)
    console.log(tenantDetails)

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
        <DashboardHeader
          heading="Tidsrom"
          text="Hvordan tidsrom skal leietakeren leie for?"
        />
        <TimeDetailsForm tenantDetails={tenantDetails} />
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
