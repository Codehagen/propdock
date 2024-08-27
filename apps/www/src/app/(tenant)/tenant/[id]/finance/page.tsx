import { getContractDetails } from "@/actions/get-contract-details"
import { getTenantDetails } from "@/actions/get-tenant-details"
import { Button } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import { format } from "date-fns"
import { Building, Home, Settings } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { EditContractSheet } from "@/components/buttons/EditContractDetails"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ContractCheck } from "@/components/tenant/ContractCheck"

export default async function EconomySettings({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = params.id

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Leietaker ikke funnet"
          text="Ugyldig leietaker-ID."
        />
      </DashboardShell>
    )
  }

  try {
    const tenantDetails = await getTenantDetails(tenantId)
    const contractDetails = await getContractDetails(tenantId)

    if (!tenantDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Feil"
            text="Leietakerdetaljer ikke funnet."
          />
        </DashboardShell>
      )
    }

    const hasContract = contractDetails && contractDetails.length > 0

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Økonomi"
          text="Økonomisk oversikt for leietakeren."
        />

        {hasContract ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                Kontraktoversikt
              </CardTitle>
              <EditContractSheet
                contractId={contractDetails[0].id}
                initialValues={{
                  contractType: contractDetails[0].contractType,
                  startDate: contractDetails[0].startDate,
                  endDate: contractDetails[0].endDate,
                  negotiationDate: contractDetails[0].negotiationDate,
                  baseRent: contractDetails[0].baseRent,
                  indexationType: contractDetails[0].indexationType,
                  indexValue: contractDetails[0].indexValue || 0,
                }}
                currentPath={`/tenant/${tenantId}/finance`}
                tenantId={tenantId}
              >
                <Button size="sm" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Rediger kontrakt
                </Button>
              </EditContractSheet>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Månedlig leie
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      contractDetails[0].baseRent ?? 0,
                      contractDetails[0].currencyIso,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Årlig leie
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      (contractDetails[0].baseRent ?? 0) * 12,
                      contractDetails[0].currencyIso,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Indeksering
                  </p>
                  <p className="text-2xl font-bold">
                    {contractDetails[0].indexationType} (
                    {contractDetails[0].indexValue}%)
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Start dato:</span>
                  <span>
                    {format(
                      new Date(contractDetails[0].startDate),
                      "dd.MM.yyyy",
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Slutt dato:</span>
                  <span>
                    {format(new Date(contractDetails[0].endDate), "dd.MM.yyyy")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kontrakttype:</span>
                  <span>{contractDetails[0].contractType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valuta:</span>
                  <span>
                    {contractDetails[0].currency} (
                    {contractDetails[0].currencyIso})
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold">
                  Eiendomsinformasjon
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {contractDetails[0].property.name} (
                      {contractDetails[0].property.type})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {contractDetails[0].building.name},{" "}
                      {contractDetails[0].building.address}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ContractCheck tenantDetails={tenantDetails} />
        )}
      </DashboardShell>
    )
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Feil"
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
