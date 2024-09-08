import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";

import { EmptyPlaceholder } from "../shared/empty-placeholder";

export default function UserCardsSection({ tenantDetails }) {
  const totalBaseRent = tenantDetails.contracts.reduce(
    (sum, contract) => sum + contract.baseRent,
    0
  );

  const indexValues = tenantDetails.contracts
    .map(contract => contract.indexValue)
    .join(", ");

  const getRemainingDays = contracts => {
    if (contracts.length === 0) {
      return null;
    }

    const currentDate = new Date();

    // Find the active or future contract with the latest end date
    const activeContract = contracts.reduce((latest, contract) => {
      const contractEndDate = new Date(contract.endDate);
      return contractEndDate > currentDate &&
        contractEndDate > new Date(latest.endDate)
        ? contract
        : latest;
    }, contracts[0]);

    if (new Date(activeContract.endDate) <= currentDate) {
      return null; // No active or future contracts
    }

    return differenceInDays(new Date(activeContract.endDate), currentDate);
  };

  const remainingDays = getRemainingDays(tenantDetails.contracts);

  return (
    <div className="-mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {totalBaseRent > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Leieinntekter</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 1 0 1 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-xl">
              {new Intl.NumberFormat("no-NO").format(totalBaseRent)} NOK
            </div>
            <p className="text-muted-foreground text-xs">
              Totale leieinntekter for dette året
            </p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="coins" />
          <EmptyPlaceholder.Title>Ingen leieinntekter</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Det er ingen leieinntekter registrert for denne leietakeren.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}

      {indexValues ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              KPI regulering
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-xl">{indexValues}</div>
            <p className="text-muted-foreground text-xs">
              Avtalte KPI reguleringen
            </p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="linechart" />
          <EmptyPlaceholder.Title>Ingen KPI regulering</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Det er ingen KPI regulering registrert for denne leietakeren.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}

      {remainingDays !== null ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Leiekontrakten går ut
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{remainingDays} dager</div>
            <p className="text-muted-foreground text-xs">igjen av leietiden</p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="map" />
          <EmptyPlaceholder.Title>Ingen leiekontrakt</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Det er ingen aktiv leiekontrakt registrert for denne leietakeren.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}

      {indexValues ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Sendte faktura
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{indexValues}</div>
            <p className="text-muted-foreground text-xs">
              Totalt sendte faktura
            </p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="piechart" />
          <EmptyPlaceholder.Title>Ingen faktura sendt</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Det er ingen faktura sendt for denne leietakeren.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  );
}
