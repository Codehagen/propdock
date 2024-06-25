import Link from "next/link";
import { redirect } from "next/navigation";
import { getTenants } from "@/actions/get-tenants";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import AddTenantDropdownButton from "@/components/buttons/AddTenantDropdownButton";
import { AddTenantSheet } from "@/components/buttons/AddTenantSheet";
import { AddWorkspaceButton } from "@/components/buttons/AddWorkspaceButton";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import PropertyMap from "@/components/maps/PropertyMap";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = {
  title: "Propdock Analyser - Oversikt over dine analyser",
  description:
    "Monitor and analyze all your critical events in real-time. Access key metrics, track important journeys, and make data-driven decisions to optimize your business performance on the Dingify Dashboard.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  // Fetch workspace associated with the user
  const userWorkspace = await prisma.workspace.findFirst({
    where: {
      users: {
        some: {
          id: user.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!userWorkspace) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Analyser"
          text="Dine analyser for dine eiendommer"
        >
          <AddWorkspaceButton />
        </DashboardHeader>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="user" />
          <EmptyPlaceholder.Title>Finn ditt workspace</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Du har ikke lagt til et workspace ennå. Legg til et workspace for å
            komme i gang.
          </EmptyPlaceholder.Description>
          <AddWorkspaceButton />
        </EmptyPlaceholder>
      </DashboardShell>
    );
  }

  // Fetch tenants associated with the user's workspace
  const { success, tenants = [], error } = await getTenants(userWorkspace.id);

  if (!success) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analyser"
        text="Dine analyser for dine eiendommer"
      >
        <AddTenantSheet />
        <AddTenantDropdownButton />
      </DashboardHeader>
      <div>
        {tenants.length === 0 ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="building" />
            <EmptyPlaceholder.Title>
              Legg til din første leietaker
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Du har ingen leietakere ennå. Legg til en leietaker for å komme i
              gang.
            </EmptyPlaceholder.Description>
            <AddTenantSheet />
          </EmptyPlaceholder>
        ) : (
          <div className="flex gap-4">
            <div className="flex-[2]">
              <PropertyMap />
            </div>
            <div className="flex-[1] space-y-4">
              {tenants.map((tenant) => (
                <Card key={tenant.id}>
                  <CardHeader>
                    <CardTitle>{tenant.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Organisasjonsnummer: {tenant.orgnr}</p>
                    <p>Antall ansatte: {tenant.numEmployees}</p>
                    <p>Bygning: {tenant.building?.name || "N/A"}</p>
                    <p>Etasje: {tenant.floor ? tenant.floor.number : "N/A"}</p>
                    <p>
                      Kontorplass:{" "}
                      {tenant.officeSpace ? tenant.officeSpace.name : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
