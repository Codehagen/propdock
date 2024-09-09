import { getTenantDetails } from "@/actions/get-tenant-details";
import React from "react";

import { AddContactPersonSheet } from "@/components/buttons/AddContactPersonSheet";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { ContractCheck } from "@/components/tenant/ContractCheck";

import { BuildingFormContract } from "./_components/BuildingFormContract";

export default async function Home({ params }: { params: { id: string } }) {
  const tenantId = params.id;

  try {
    const tenantDetails = await getTenantDetails(tenantId);

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
              currentPath={`/tenant/${tenantId}/contract/building`}
            />
          </EmptyPlaceholder>
        </DashboardShell>
      );
    }

    const hasContract =
      tenantDetails.contracts && tenantDetails.contracts.length > 0;

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Byggninger"
          text="Hvordan byggning skal leietakeren inn i?"
        />
        {hasContract ? (
          <BuildingFormContract tenantDetails={tenantDetails} />
        ) : (
          <ContractCheck tenantDetails={tenantDetails} />
        )}
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    );
  }
}
