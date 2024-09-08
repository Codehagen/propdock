import { getTenantDetails } from "@/actions/get-tenant-details";
import { getWsApiKeys } from "@/actions/get-ws-api-keys";
import { Button } from "@propdock/ui/components/button";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import TenantSendInvoice from "@/components/tenant/TenantSendInvoice";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { poweroffice } from "@/lib/poweroffice-sdk";

export default async function InvoicePage({
  params
}: {
  params: { id: string };
}) {
  const tenantId = params.id;

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Contact Person not found"
          text="Invalid contact person ID."
        />
      </DashboardShell>
    );
  }

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { workspaceId: true }
  });

  try {
    const tenantDetails = await getTenantDetails(tenantId);
    const { customers, products } = await poweroffice.getCustomersAndProducts();
    const { success, apiKeys } = await getWsApiKeys(user.workspaceId);

    if (!success || apiKeys.length === 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Faktura"
            text="Du må først legge til regnskapsprogram for å sende faktura."
          />
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="user" />
            <EmptyPlaceholder.Title>
              Legg til regnskapsprogram
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Legg til regnskapsprogram for å sende faktura.
            </EmptyPlaceholder.Description>
            <Button variant="outline">
              <Link href="/settings/import">Legg til regnskapsprogram</Link>
            </Button>
          </EmptyPlaceholder>
        </DashboardShell>
      );
    }

    if (!tenantDetails || tenantDetails.contacts.length === 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Invoice"
            text="Du må først legge til kontatpersoner før du kan se dem her."
          />
          <TenantSendInvoice customers={customers} products={products} />
        </DashboardShell>
      );
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om kontaktpersonene."
        />
        <TenantSendInvoice customers={customers} products={products} />
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in InvoicePage:", error);
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Faktura"
          text="Du må først legge til regnskapsprogram for å sende faktura."
        />
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="user" />
          <EmptyPlaceholder.Title>
            Legg til regnskapsprogram
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Legg til regnskapsprogram for å sende faktura.
          </EmptyPlaceholder.Description>
          <Button variant="outline">
            <Link href="/settings/import">Legg til regnskapsprogram</Link>
          </Button>
        </EmptyPlaceholder>
      </DashboardShell>
    );
  }
}
