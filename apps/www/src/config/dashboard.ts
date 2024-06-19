import type { DashboardConfig } from "@/types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Eiendommer",
      href: "/property",
      // disabled: true,
    },
    {
      title: "Leietakere",
      href: "/tenant"
    },
    {
      title: "Analyser",
      href: "/analytics"
    },
    {
      title: "Innstillinger",
      href: "/settings"
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "Eiendommer",
      href: "/property",
      icon: "building",
    },
    {
      title: "Leietakere",
      href: "/tenant",
      icon: "user",
    },
    {
      title: "Analyser",
      href: "/dashboard/analytics",
      icon: "piechart",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};
