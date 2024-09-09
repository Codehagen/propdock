import { getUserChannels } from "@/actions/Dingify/get-channels";
import type { SidebarNavItem } from "@/types";
import { notFound } from "next/navigation";

import { DashboardNav } from "@/components/layout/nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  // const userChannels = await getUserChannels();

  const sidebarNavItems: SidebarNavItem[] = [
    {
      title: "Oversikt",
      href: "/settings",
      icon: "home",
    },
    {
      title: "Import",
      href: "/settings/import",
      icon: "refresh",
    },
    {
      title: "Api-nøkkel",
      href: "/settings/api",
      icon: "key",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <NavBar user={user} items={dashboardConfig.mainNav} scroll={false} />

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={sidebarNavItems} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
