import { getTenantDetails } from "@/actions/get-tenant-details"
import { Settings } from "lucide-react"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"

import { AddContactPersonSheet } from "@/components/buttons/AddContactPersonSheet"
import { EditContactPersonSheet } from "@/components/buttons/EditContactPersonSheet"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import TenantSendInvoice from "@/components/tenant/TenantSendInvoice"

export default async function ContactPerson({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = params.id

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Contact Person not found"
          text="Invalid contact person ID."
        />
      </DashboardShell>
    )
  }

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (!tenantDetails || tenantDetails.contacts.length === 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Invoice"
            text="Du må først legge til kontatpersoner før du kan se dem her."
          />
          {/* <EmptyPlaceholder>
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
          </EmptyPlaceholder> */}
          <TenantSendInvoice />
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om kontaktpersonene."
        ></DashboardHeader>
        <div>asdasda</div>
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
