import { redirect } from "next/navigation"
import { getUserCredits } from "@/actions/Dingify/get-credits"
import { getEventStats } from "@/actions/stats/get-events-stats"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AddPropertyButton } from "@/components/buttons/AddPropertyButton"
import { AddWorkspaceButton } from "@/components/buttons/AddWorkspaceButton"
import DashboardCardsTop from "@/components/dashboard/DashboardCardsTop"
import DashboardMainDashboard from "@/components/dashboard/DashboardMainDashboard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export const metadata = {
  title: "Propdock Dashboard - Your Alerts Overview",
  description:
    "Monitor and analyze all your critical events in real-time. Access key metrics, track important journeys, and make data-driven decisions to optimize your business performance on the Dingify Dashboard.",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  // Fetch workspace associated with the user
  const userWorkspace = await prisma.workspace.findFirst({
    where: {
      users: {
        some: {
          id: user.id,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!userWorkspace) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="">
          <AddWorkspaceButton />
        </DashboardHeader>
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="user" />
          <EmptyPlaceholder.Title>Finn ditt workspace</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Du har ikke lagt til et workspace ennå. Legg til et workspace for å
            komme i gang.
          </EmptyPlaceholder.Description>
          <AddWorkspaceButton />
        </EmptyPlaceholder>
      </DashboardShell>
    )
  }

  // Fetch properties associated with the user's workspace
  const properties = await prisma.property.findMany({
    where: {
      workspaceId: userWorkspace.id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  console.log(properties)

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Generell oversikt">
        <AddPropertyButton />
      </DashboardHeader>
      <div>
        {properties.length === 0 ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="building" />
            <EmptyPlaceholder.Title>
              Legg til din første eiendom
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Skriv noe her hvorfor vi trenger de å legge til første eiendom.
            </EmptyPlaceholder.Description>
            <AddPropertyButton />
          </EmptyPlaceholder>
        ) : (
          // <EventsDashboard events={events} eventStats={eventStats} />
          <DashboardMainDashboard properties={properties} />
        )}
      </div>
    </DashboardShell>
  )
}
