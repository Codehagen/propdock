import Link from "next/link"
import { redirect } from "next/navigation"
import { getAnalyses } from "@/actions/get-analyst"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AddAnalysisSheet } from "@/components/buttons/AddAnalysisSheet"
import { AddWorkspaceButton } from "@/components/buttons/AddWorkspaceButton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import PropertyMap from "@/components/maps/PropertyMap"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export const metadata = {
  title: "Propdock Analyser - Oversikt over dine analyser",
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
        <DashboardHeader
          heading="Analyser"
          text="Dine analyser for dine eiendommer"
        >
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

  // Fetch analyses associated with the user's workspace
  const { success, analyses = [], error } = await getAnalyses(userWorkspace.id)

  if (!success) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error} />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analyser"
        text="Dine analyser for dine eiendommer"
      >
        <AddAnalysisSheet />
        {/* <AddTenantDropdownButton /> */}
      </DashboardHeader>
      <div>
        {analyses.length === 0 ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="building" />
            <EmptyPlaceholder.Title>
              Legg til din første analyse
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Du har ingen analyser ennå. Legg til en analyse for å komme i
              gang.
            </EmptyPlaceholder.Description>
            <AddAnalysisSheet />
          </EmptyPlaceholder>
        ) : (
          <div className="flex gap-4">
            <div className="flex-[2]">
              <PropertyMap />
            </div>
            <div className="flex-[1] space-y-4">
              {analyses.map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <Link href={`/analytics/${analysis.id}`}>
                      <CardTitle>{analysis.name}</CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p>Bygning: {analysis.building?.name || "N/A"}</p>
                    <p>Utleibart areal: {analysis.rentableArea}</p>
                    <p>Leiepris per kvm per år: {analysis.rentPerArea}</p>
                    <p>Sum nåverdi: {analysis.sumValueNow}</p>
                    <p>Exit verdi: {analysis.sumValueExit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
