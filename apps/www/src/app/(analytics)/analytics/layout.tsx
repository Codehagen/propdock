import type { SidebarNavItem } from "@/types"
import { notFound } from "next/navigation"
import { getUserChannels } from "@/actions/Dingify/get-channels"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { DashboardNav } from "@/components/layout/nav"
import { NavBar } from "@/components/layout/navbar"
import { SiteFooter } from "@/components/layout/site-footer"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const sidebarNavItems: SidebarNavItem[] = [
    {
      title: "Data",
      href: "/analytics/",
      icon: "home",
    },
    {
      title: "Kart",
      href: "/analytics/maps",
      icon: "map",
    },
    {
      title: "API nøkkel",
      href: "/analytics/1",
      icon: "piechart",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <NavBar user={user} items={dashboardConfig.mainNav} scroll={false} />

      <div className="container flex-1 gap-12">
        {/*         <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={sidebarNavItems} />
        </aside> */}
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
