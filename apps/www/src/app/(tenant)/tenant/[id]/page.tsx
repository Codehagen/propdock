import Link from "next/link"
import { getTenantDetails } from "@/actions/get-tenant-details"
import { Button } from "@propdock/ui/components/button"

import { AddContactPersonSheet } from "@/components/buttons/AddContactPersonSheet"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import UserCard from "@/components/users/UserCard"

export default async function TenantDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = params.id

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Tenant not found" text="Invalid tenant ID." />
      </DashboardShell>
    )
  }

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (!tenantDetails || tenantDetails.contacts.length === 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Legg til kontaktpersoner"
            text="Du må først legge til kontatpersoner før du kan se dem her."
          />
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="user" />
            <EmptyPlaceholder.Title>
              Ingen kontaktpersoner
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Legg til kontaktpersoner tilknyttet leietakeren.
            </EmptyPlaceholder.Description>
            <AddContactPersonSheet
              tenantId={tenantDetails?.id}
              currentPath={`/tenant/${tenantId}/contacts`}
            />
          </EmptyPlaceholder>
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        {/* <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om leietaker."
        /> */}
        <div>
          <UserCard tenantDetails={tenantDetails} />
        </div>
      </DashboardShell>
    )
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={(error as Error).message} />
      </DashboardShell>
    )
  }
}
