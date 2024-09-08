import { Button } from "@propdock/ui/components/button";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { CardSkeleton } from "@/components/shared/card-skeleton";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Your analytics dashboard">
        <Button>Please wait...</Button>
      </DashboardHeader>
      <div className="divide-y divide-border-200 rounded-md border">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}
