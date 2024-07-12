import Link from "next/link"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { Button } from "@dingify/ui/components/button"

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

    if (!tenantDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Tenant not found"
            text="We couldn't find the tenant you're looking for."
          />
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om leietaker."
        ></DashboardHeader>
        <div>
          <UserCard tenantDetails={tenantDetails} />
        </div>
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
