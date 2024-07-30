import React from "react"
import Link from "next/link"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { Button } from "@dingify/ui/components/button"
import { Card } from "@dingify/ui/components/card"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import { ContractCheck } from "@/components/tenant/ContractCheck"

import { TermsDetailsForm } from "./_components/TermsDetailsForm"

export default async function termsContractPage({
  params,
}: {
  params: { id: string }
}) {
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
          heading="Vilkår"
          text="Hvilke vilkår skal leietakeren ha?"
        />
        {hasContract ? (
          <TermsDetailsForm tenantDetails={tenantDetails} />
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
