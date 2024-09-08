import type { SidebarNavItem } from "@/types";
import { notFound } from "next/navigation";

import { DashboardNav } from "@/components/layout/nav";
import { getCurrentUser } from "@/lib/session";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: { id: string };
}

export default async function DashboardLayout({
  children,
  params
}: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  const sidebarNavItems: SidebarNavItem[] = [
    {
      title: "Oversikt",
      href: `/tenant/${params.id}`,
      icon: "home"
    },
    {
      title: "Bygg",
      href: `/tenant/${params.id}/building`,
      icon: "building"
    },
    {
      title: "Kontaktperson",
      href: `/tenant/${params.id}/contactperson`,
      icon: "user"
    },
    {
      title: "Tidslinje",
      href: `/tenant/${params.id}/timeline`,
      icon: "calendarClock"
    },
    {
      title: "Økonomi",
      href: `/tenant/${params.id}/finance`,
      icon: "piechart"
    },
    {
      title: "Kontrakt",
      href: `/tenant/${params.id}/contract/building`,
      icon: "filetext"
    },
    {
      title: "Faktura",
      href: `/tenant/${params.id}/invoice`,
      icon: "billing"
    },
    {
      title: "E-signering",
      href: `/tenant/${params.id}/esign`,
      icon: "signature"
    },
    {
      title: "Dokumenter",
      href: `/tenant/${params.id}/files`,
      icon: "file"
    }
  ];

  return (
    <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav items={sidebarNavItems} />
      </aside>
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
