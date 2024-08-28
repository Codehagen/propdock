// pages/settings/api.js
import Link from "next/link"
import { redirect } from "next/navigation"
import { getAnalyses } from "@/actions/get-analyst"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@propdock/ui/components/tabs"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AnalysesTable } from "@/components/analyse/AnalysesTable"
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
        text="Oversikt over dine eiendomsanalyser"
      >
        <AddAnalysisSheet />
      </DashboardHeader>
      {analyses.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="building" />
          <EmptyPlaceholder.Title>
            Legg til din første analyse
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Du har ingen analyser ennå. Legg til en analyse for å komme i gang.
          </EmptyPlaceholder.Description>
          <AddAnalysisSheet />
        </EmptyPlaceholder>
      ) : (
        <Tabs defaultValue="map" className="w-full">
          <TabsList>
            <TabsTrigger value="map">Kart</TabsTrigger>
            <TabsTrigger value="table">Eiendommer</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <AnalysesTable analyses={analyses} />
          </TabsContent>
          <TabsContent value="map">
            <PropertyMap />
          </TabsContent>
        </Tabs>
      )}
    </DashboardShell>
  )
}
