import type { SidebarNavItem } from "@/types"
import { notFound } from "next/navigation"

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

  if (!user) {
    return notFound()
  }

  const sidebarNavItems: SidebarNavItem[] = [
    {
      title: "Dashboard",
      href: `/analytics/${params.id}/dashboard`,
      icon: "layout",
    },
    {
      title: "Endre verdier",
      href: `/analytics/${params.id}`,
      icon: "pen",
    },
    {
      title: "Kontantstrøm",
      href: `/analytics/${params.id}/dcf`,
      icon: "piechart",
    },
    {
      title: "Sensitivitetsanalyse",
      href: `/analytics/${params.id}/sensitivity`,
      icon: "barchart",
    },
    {
      title: "Leietakere",
      href: `/analytics/${params.id}/tenants`,
      icon: "user",
    },
  ]

  return (
    <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
      <aside className="w-[200px] flex-col md:flex">
        <DashboardNav items={sidebarNavItems} />
      </aside>
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
