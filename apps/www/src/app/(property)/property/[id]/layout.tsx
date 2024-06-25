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
      title: "Oversikt",
      href: `/property/${params.id}`,
      icon: "home",
    },
    {
      title: "Bygg",
      href: `/property/${params.id}/building`,
      icon: "building",
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
