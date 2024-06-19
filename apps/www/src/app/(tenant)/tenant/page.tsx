import Link from "next/link";
import { redirect } from "next/navigation";
import { getTenants } from "@/actions/get-tenants";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { AddTenantSheet } from "@/components/buttons/AddTenantSheet";
import { AddWorkspaceButton } from "@/components/buttons/AddWorkspaceButton";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = {
  title: "Dingify Dashboard - Your Alerts Overview",
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
        <DashboardHeader heading="Leietakere" text="Dine leietakere">
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
      <DashboardHeader heading="Leietakere" text="Dine leietakere">
        <AddTenantSheet />
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
          <div>
            <h2 className="text-bold mb-4">Velg leietaker</h2>
            <ul>
              {tenants.map((tenant) => (
                <li key={tenant.id}>
                  <p>
                    <Link
                      className="text-bold underline"
                      href={`/tenant/${tenant.id}`}
                    >
                      {tenant.name}
                    </Link>
                  </p>
                  <p>Organization Number: {tenant.orgnr}</p>
                  <p>Number of Employees: {tenant.numEmployees}</p>
                  <p>Building: {tenant.building?.name || "N/A"}</p>
                  <p>Floor: {tenant.floor ? tenant.floor.number : "N/A"}</p>
                  <p>
                    Office Space:{" "}
                    {tenant.officeSpace ? tenant.officeSpace.name : "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
