import { getTenantDetails } from "@/actions/get-tenant-details";
import { getServerSession } from "next-auth/next";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import CustomerTimeline from "@/components/tenant/CustomerTimeline";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function TimelinePage({
  params
}: {
  params: { id: string };
}) {
  const tenantId = params.id;

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Tenant not found" text="Invalid tenant ID." />
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

    if (!tenantDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Tenant not found"
            text="Unable to retrieve tenant details."
          />
        </DashboardShell>
      );
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={`${tenantDetails.name} Tidslinje`}
          text="Se kundeinteraksjoner og viktige hendelser."
        />
        <CustomerTimeline />
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error in TimelinePage:", error);
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    );
  }
}
