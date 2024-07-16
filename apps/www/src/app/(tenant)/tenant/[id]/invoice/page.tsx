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

const mockCustomers = [
  { id: "genesis", name: "Proaktiv Eiendomsmegling", orgnr: "123456789" },
  { id: "explorer", name: "Neural Explorer", orgnr: "987654321" },
  { id: "quantum", name: "Neural Quantum", orgnr: "192837465" },
]

const mockProducts = [
  { id: "product1", name: "Produkt 1", price: 100 },
  { id: "product2", name: "Produkt 2", price: 200 },
  { id: "product3", name: "Produkt 3", price: 300 },
]

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
          <TenantSendInvoice
            customers={mockCustomers}
            products={mockProducts}
          />
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om kontaktpersonene."
        />
        <TenantSendInvoice customers={mockCustomers} products={mockProducts} />
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
