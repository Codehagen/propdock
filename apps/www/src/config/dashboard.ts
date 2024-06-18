import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Docs",
      href: "https://docs.dingify.io/",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
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
      href: "/dashboard/users",
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
    // {
    //   title: "Placeholder Names",
    //   href: "/dashboard/channels",
    // },
    // {
    //   title: "Marketing",
    //   href: "/dashboard/channels/marketing",
    // },
    // {
    //   title: "Sales",
    //   href: "/dashboard/channels/sales",
    // },
  ],
};
