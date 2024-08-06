import { getTenantDetails } from "@/actions/get-tenant-details"
import { Settings } from "lucide-react"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"

import { poweroffice } from "@/lib/poweroffice-sdk"
import { AddContactPersonSheet } from "@/components/buttons/AddContactPersonSheet"
import { EditContactPersonSheet } from "@/components/buttons/EditContactPersonSheet"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import TenantSendInvoice from "@/components/tenant/TenantSendInvoice"

export default async function InvoicePage({
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
    const { customers, products } = await poweroffice.getCustomersAndProducts()

    if (!tenantDetails || tenantDetails.contacts.length === 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Invoice"
            text="Du må først legge til kontatpersoner før du kan se dem her."
          />
          <TenantSendInvoice customers={customers} products={products} />
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om kontaktpersonene."
        />
        <TenantSendInvoice customers={customers} products={products} />
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error in InvoicePage:", error)
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    )
  }
}
