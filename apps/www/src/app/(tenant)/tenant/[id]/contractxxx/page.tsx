import React, { useState } from "react"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { generateContractContent } from "@/components/editor/contractTemplate"
import TenantEditor from "@/components/editor/TenantEditor"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export default async function Home({ params }: { params: { id: string } }) {
  const tenantId = parseInt(params.id)

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    const missingFields: string[] = []
    if (!tenantDetails?.contacts || tenantDetails.contacts.length === 0) {
      missingFields.push("Du må legge til kontaktperson")
    }
    if (!tenantDetails?.contracts || tenantDetails.contracts.length === 0) {
      missingFields.push("Du må legge til kontrakt")
    }

    if (missingFields.length > 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Kontrakter"
            text="Du må fikse følgende før du kan lage kontrakt."
          />
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="help" />
            <EmptyPlaceholder.Title>Du mangler følgende</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              <ul>
                {missingFields.map((field, index) => (
                  <li className="font-bold" key={index}>
                    {field}
                  </li>
                ))}
              </ul>
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        </DashboardShell>
      )
    }

    const contractContent = generateContractContent(tenantDetails)

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Kontrakter"
          text="Skriv kontrakt for din leietaker."
        />
        <TenantEditor contractContent={contractContent} />
        {/* <Tiptap /> */}
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
