// pages/settings/api.js
import Link from "next/link"
import { redirect } from "next/navigation"
import { getAnalyses } from "@/actions/get-analyst"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dingify/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@dingify/ui/components/tabs"

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
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Eiendommer</TabsTrigger>
            <TabsTrigger value="map">Kart</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Analyser</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>Bygning</TableHead>
                      <TableHead className="text-right">
                        Utleibart areal (m²)
                      </TableHead>
                      <TableHead className="text-right">
                        Leiepris (NOK/m²/år)
                      </TableHead>
                      <TableHead className="text-right">Nåverdi</TableHead>
                      <TableHead className="text-right">Exit verdi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell>
                          <Link
                            href={`/analytics/${analysis.id}`}
                            className="font-medium hover:underline"
                          >
                            {analysis.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {analysis.building?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          {analysis.rentableArea.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {analysis.rentPerArea.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {analysis.sumValueNow}
                        </TableCell>
                        <TableCell className="text-right">
                          {analysis.sumValueExit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="map">
            <PropertyMap />
          </TabsContent>
        </Tabs>
      )}
    </DashboardShell>
  )
}
