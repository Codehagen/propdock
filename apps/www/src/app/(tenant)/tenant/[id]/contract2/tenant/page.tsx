import React, { useState } from "react"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { Card } from "@dingify/ui/components/card"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { generateContractContent } from "@/components/editor/contractTemplate"
import Editor from "@/components/editor/editor"
import { initialContent } from "@/components/editor/initialContent"
import TenantEditor from "@/components/editor/TenantEditor"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

import { TenantDetailsForm } from "./_components/TenantDetailsForm"

export default async function Home({ params }: { params: { id: string } }) {
  const tenantId = parseInt(params.id)

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (tenantDetails?.name && parseInt(tenantDetails.name) > 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Byggninger"
            text="Hvordan byggning skal leietakeren inn i?"
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
          heading="Byggninger"
          text="Hvordan byggning skal leietakeren inn i?"
        />
        <TenantDetailsForm tenantDetails={tenantDetails} />
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
