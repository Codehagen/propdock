import { getContractDetails } from "@/actions/get-contract-details"
import { format } from "date-fns"
import { Plus, Settings } from "lucide-react"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"
import { Skeleton } from "@dingify/ui/components/skeleton"

import { EditContractSheet } from "@/components/buttons/EditContractDetails"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export default async function EconomySettings({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = params.id

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Tenant not found" text="Invalid tenant ID." />
      </DashboardShell>
    )
  }

  try {
    const contractDetails = await getContractDetails(tenantId)

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Økonomi"
          text="Endre økonomiske innstillinger for leietakeren."
        >
          <EditContractSheet
            contractId={0}
            initialValues={{
              contractType: "LEASE",
              startDate: new Date(),
              endDate: new Date(),
              negotiationDate: new Date(),
              baseRent: 0,
              indexationType: "MARKET",
              indexValue: 0,
              tenantid: tenantId,
            }}
            currentPath={`/tenant/${tenantId}/economy`}
            tenantId={tenantId}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Legg til kontrakt
            </Button>
          </EditContractSheet>
        </DashboardHeader>

        {!contractDetails || contractDetails.length === 0 ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="receipt" />
            <EmptyPlaceholder.Title>
              Vilkår til leietakeren
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Legg til vilkårene til leietakeren.
            </EmptyPlaceholder.Description>
            <EditContractSheet
              contractId={0}
              initialValues={{
                contractType: "LEASE",
                startDate: new Date(),
                endDate: new Date(),
                negotiationDate: new Date(),
                baseRent: 0,
                indexationType: "MARKET",
                indexValue: 0,
                tenantid: tenantId,
              }}
              currentPath={`/tenant/${tenantId}/economy`}
              tenantId={tenantId}
            >
              <Button variant="outline">Legg til kontrakt</Button>
            </EditContractSheet>
          </EmptyPlaceholder>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Kontraktoversikt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Totalt antall kontrakter
                    </p>
                    <p className="text-2xl font-bold">
                      {contractDetails.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total leie
                    </p>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat("no-NO", {
                        style: "currency",
                        currency: "NOK",
                      }).format(
                        contractDetails.reduce(
                          (sum, contract) => sum + (contract.baseRent ?? 0),
                          0,
                        ),
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Gjennomsnittlig leie
                    </p>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat("no-NO", {
                        style: "currency",
                        currency: "NOK",
                      }).format(
                        contractDetails.reduce(
                          (sum, contract) => sum + (contract.baseRent ?? 0),
                          0,
                        ) / contractDetails.length,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {contractDetails.map((contract) => (
                <Card key={contract.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {contract.contractType}
                    </CardTitle>
                    <EditContractSheet
                      contractId={contract.id}
                      initialValues={{
                        contractType: contract.contractType,
                        startDate: contract.startDate,
                        endDate: contract.endDate,
                        negotiationDate: contract.negotiationDate,
                        baseRent: contract.baseRent,
                        indexationType: contract.indexationType,
                        indexValue: contract.indexValue || 0,
                      }}
                      currentPath={`/tenant/${tenantId}/economy`}
                      tenantId={tenantId}
                    >
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </EditContractSheet>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("no-NO", {
                        style: "currency",
                        currency: "NOK",
                      }).format(contract.baseRent ?? 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">per måned</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Start dato:
                        </span>
                        <span>
                          {format(new Date(contract.startDate), "dd.MM.yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Slutt dato:
                        </span>
                        <span>
                          {format(new Date(contract.endDate), "dd.MM.yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Indeksering:
                        </span>
                        <span>{contract.indexationType}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </DashboardShell>
    )
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Error"
          text="Det oppstod en feil ved henting av kontraktdetaljer."
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Feilmelding: {error.message}
            </p>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[300px]" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-5 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
