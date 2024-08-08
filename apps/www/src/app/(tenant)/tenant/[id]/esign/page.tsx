import Link from "next/link"
import { getTenantDetails } from "@/actions/get-tenant-details"
import { getWsApiKeys } from "@/actions/get-ws-api-keys"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { poweroffice } from "@/lib/poweroffice-sdk"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import ESignMainComponent from "@/components/esign/esignMainComponent"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import TenantSendInvoice from "@/components/tenant/TenantSendInvoice"

export default async function EsignPage({
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

  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { workspaceId: true },
  })

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (!tenantDetails || tenantDetails.contacts.length === 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="E-signering"
            text="Du må først legge til kontatpersoner fr du kan se dem her."
          />
          <ESignMainComponent />
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Her kan du sende ut dokumenter for digital signering."
        />
        <ESignMainComponent />
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
