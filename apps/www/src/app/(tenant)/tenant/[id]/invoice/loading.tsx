import { Button } from "@propdock/ui/components/button";
import { Skeleton } from "@propdock/ui/components/skeleton";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default function InvoiceLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Lag faktura"
        text="Laster inn fakturadetaljer..."
      >
        <Button disabled>
          <Skeleton className="h-4 w-[100px]" />
        </Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </DashboardShell>
  );
}
