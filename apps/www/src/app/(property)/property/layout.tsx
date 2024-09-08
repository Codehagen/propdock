import { notFound } from "next/navigation";

import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

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
  );
}
