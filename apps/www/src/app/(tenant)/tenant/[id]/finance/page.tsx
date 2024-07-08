import { getContractDetails } from "@/actions/get-contract-details";
import { format } from "date-fns";
import { Settings } from "lucide-react";

import { Button } from "@dingify/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card";

import { EditContractSheet } from "@/components/buttons/EditContractDetails";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default async function EconomySettings({
  params,
}: {
  params: { id: string };
}) {
  const tenantId = params.id;

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Tenant not found" text="Invalid tenant ID." />
      </DashboardShell>
    );
  }

  try {
    const contractDetails = await getContractDetails(tenantId);

    return (
      <DashboardShell>
        <DashboardHeader
          heading="Økonomi"
          text="Endre økonomiske innstillinger for leietakeren."
        />
        <div>
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
                contractId={0} // Use 0 or some other identifier for new contracts
                initialValues={{
                  contractType: "LEASE", // Default value for new contract
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contractDetails.map((contract) => (
                <Card key={contract.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="flex w-full items-center justify-between">
                      <CardTitle className="text-lg">
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
                        <Button className="h-8 w-8" size="icon" variant="ghost">
                          <Settings className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </EditContractSheet>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Start Date
                          </span>
                          <span>
                            {format(new Date(contract.startDate), "dd.MM.yyyy")}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">End Date</span>
                          <span>
                            {format(new Date(contract.endDate), "dd.MM.yyyy")}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Base Rent</span>
                          <span>
                            {contract.baseRent.toLocaleString("no-NO")} NOK
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Indexation Type
                          </span>
                          <span>{contract.indexationType}</span>
                        </li>
                        {contract.indexValue && (
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Index Value
                            </span>
                            <span>{contract.indexValue}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    );
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    );
  }
}
