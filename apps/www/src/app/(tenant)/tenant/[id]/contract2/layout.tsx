import type { SidebarNavItem } from "@/types"
import type { Contact, Contract, TenantDetails } from "@/types/types"
import { notFound } from "next/navigation"
import { getTenantDetails } from "@/actions/get-tenant-details"

import { getCurrentUser } from "@/lib/session"
import { DashboardNav } from "@/components/layout/nav"

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: { id: string }
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()
  const tenantDetails: TenantDetails | null = await getTenantDetails(params.id)

  if (!user || !tenantDetails) {
    return notFound()
  }

  const contract: Contract | undefined = tenantDetails.contracts[0]

  const isLandlordCompleted = Boolean(
    contract?.landlordName && contract.landlordOrgnr !== null,
  )

  const isTenantCompleted = Boolean(
    contract?.contactName &&
      contract.contactEmail &&
      contract.contactPhone !== null,
  )

  const isTimeCompleted = Boolean(contract?.startDate && contract.endDate)

  const isTermsCompleted = Boolean(
    contract && contract.baseRent !== null && contract.isRenewable !== null,
  )

  const isKpiCompleted = Boolean(
    contract?.indexationType &&
      contract.indexValue !== null &&
      contract.indexationDate,
  )

  const sidebarNavItems: SidebarNavItem[] = [
    {
      title: "Eiendom",
      href: `/tenant/${params.id}/contract2/building`,
      icon: "home",
      completed: true, // Always true as per your initial setup
    },
    {
      title: "Utleier",
      href: `/tenant/${params.id}/contract2/landlord`,
      icon: "building",
      completed: isLandlordCompleted,
    },
    {
      title: "Leietaker",
      href: `/tenant/${params.id}/contract2/tenant`,
      icon: "user",
      completed: isTenantCompleted,
    },
    {
      title: "Tidsrom",
      href: `/tenant/${params.id}/contract2/time`,
      icon: "calendarClock",
      completed: isTimeCompleted,
    },
    {
      title: "Leieinntekter",
      href: `/tenant/${params.id}/contract2/terms`,
      icon: "piechart",
      completed: isTermsCompleted,
    },
    {
      title: "KPI",
      href: `/tenant/${params.id}/contract2/kpi`,
      icon: "percent",
      completed: isKpiCompleted,
    },
    {
      title: "Sammendrag",
      href: `/tenant/${params.id}/contract2/summary`,
      icon: "filetext",
      completed: false, // Assuming summary is never initially completed
    },
  ]

  return (
    <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav items={sidebarNavItems} />
      </aside>
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
