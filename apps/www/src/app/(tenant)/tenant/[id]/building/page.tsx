import { getTenantDetails } from "@/actions/get-tenant-details"
import { format } from "date-fns"
import { Settings } from "lucide-react"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export default async function BuildingTenant({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = parseInt(params.id)

  if (isNaN(tenantId)) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Tenant not found" text="Invalid tenant ID." />
      </DashboardShell>
    )
  }

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (!tenantDetails || !tenantDetails.building || !tenantDetails.property) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Ingen bygning valgt"
            text="Leietakere må være assosierte med en bygning."
          />
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="building" />
            <EmptyPlaceholder.Title>Ingen bygning valgt</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Leietakere må være assosierte med en bygning.
            </EmptyPlaceholder.Description>
            <Button variant="outline">Legg til bygning</Button>
          </EmptyPlaceholder>
        </DashboardShell>
      )
    }

    const formattedCreationDate = tenantDetails.createdAt
      ? format(new Date(tenantDetails.createdAt), "dd.MM.yyyy")
      : "N/A"
    const formattedUpdatedDate = tenantDetails.updatedAt
      ? format(new Date(tenantDetails.updatedAt), "dd.MM.yyyy")
      : "N/A"

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Bygning"
          text={`Informasjon om bygningen knyttet til leietakeren: ${tenantDetails.building.name}`}
        >
          <Button variant="outline">Endre bygning</Button>
        </DashboardHeader>
        <div>
          <Card key={tenantDetails.building.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="flex w-full items-center justify-between">
                <CardTitle className="text-lg">
                  {tenantDetails.building.name}
                </CardTitle>
                <Button className="h-8 w-8" size="icon" variant="ghost">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Navn</span>
                    <span>{tenantDetails.building.name}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Adresse</span>
                    <span>{tenantDetails.building.address}</span>
                  </li>
                  {/* Add more building details as needed */}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Opprettet</span>
                    <span>{formattedCreationDate}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Oppdatert</span>
                    <span>{formattedUpdatedDate}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card key={tenantDetails.property.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="flex w-full items-center justify-between">
                <CardTitle className="text-lg">
                  {tenantDetails.property.name}
                </CardTitle>
                <Button className="h-8 w-8" size="icon" variant="ghost">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Navn</span>
                    <span>{tenantDetails.property.name}</span>
                  </li>
                  {/* Add more property details as needed */}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    )
  }
}
