import React from "react"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { AddContactPersonSheet } from "@/components/buttons/AddContactPersonSheet"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { generateContractContent } from "@/components/editor/contractTemplate"
import Editor from "@/components/editor/editor"
import { initialContent } from "@/components/editor/initialContent"
import TenantEditor from "@/components/editor/TenantEditor"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export default async function Home({ params }: { params: { id: string } }) {
  const tenantId = parseInt(params.id)

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
        <DashboardHeader
          heading="Kontrakter"
          text="Skriv kontrakt for din leietaker."
        />
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
