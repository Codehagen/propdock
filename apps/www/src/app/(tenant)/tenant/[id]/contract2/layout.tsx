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
      title: "Eiendom",
      href: `/tenant/${params.id}/contract2/building`,
      icon: "home",
    },
    {
      title: "Leietaker",
      href: `/tenant/${params.id}/contract2/tenant`,
      icon: "building",
    },
    {
      title: "Utleie",
      href: `/tenant/${params.id}/contactperson`,
      icon: "user",
    },
    {
      title: "Økonomi",
      href: `/tenant/${params.id}/finance`,
      icon: "piechart",
    },
    {
      title: "Vilkår",
      href: `/tenant/${params.id}/contract`,
      icon: "filetext",
    },
    {
      title: "Faktura",
      href: `/tenant/${params.id}/invoice`,
      icon: "billing",
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
