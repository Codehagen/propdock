import { redirect } from "next/navigation"
import { getAnalyticsStats } from "@/actions/stats/get-analytics-stats"
import { getUserStats } from "@/actions/stats/get-users-stats"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import CardSection from "@/components/analytics/CardSection"
import EventsTrendOverTimeChart from "@/components/dashboard/charts/EventsTrendOverTime"
import UserGrowthTrend from "@/components/dashboard/charts/UserGrowthChart"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export const metadata = {
  title: "Propdock Analyse - Din Eiendomsoversikt",
  description:
    "Overvåk og analyser alle dine kritiske eiendomshendelser i sanntid. Få tilgang til nøkkelmetrikker, spor viktige leietakerreiser, og ta datadrevne beslutninger for å optimalisere ytelsen til din eiendomsportefølje på Propdock-dashbordet.",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  //TODO Make these calls dynamic
  // const { monthlyEvents, eventTypeBreakdown } = await getAnalyticsStats();
  // const { totalUsers, usersToday, usersThisWeek, usersThisMonth } =
  //   await getUserStats();
  // console.log(
  //   "monthlyEvents",
  //   totalUsers,
  //   usersToday,
  //   usersThisWeek,
  //   usersThisMonth,
  // );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="Your analytics dashboard"
      ></DashboardHeader>
      <div>
        <CardSection
        // totalUsers={totalUsers}
        // usersToday={usersToday}
        // usersThisWeek={usersThisWeek}
        // usersThisMonth={usersThisMonth}
        />
        <EventsTrendOverTimeChart
        // lineChartData={monthlyEvents}
        // barChartData={eventTypeBreakdown}
        />
        <UserGrowthTrend />
      </div>
    </DashboardShell>
  )
}
