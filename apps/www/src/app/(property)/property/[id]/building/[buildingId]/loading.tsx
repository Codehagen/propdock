import { Skeleton } from "@propdock/ui/components/skeleton"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export default function InvoiceLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Lag faktura"
        text="Laster inn fakturadetaljer..."
      >
        <Skeleton className="h-10 w-[100px]" />
      </DashboardHeader>
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[150px]" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
