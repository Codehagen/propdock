import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import { format } from "date-fns"

import { EmptyPlaceholder } from "../shared/empty-placeholder"
import AnalysesScoreBuilding from "./AnalysesScoreBuilding"

export function AnalystCardsSection({ analysisDetails }) {
  const {
    name,
    rentableArea,
    rentPerArea,
    sumValueNow,
    roiCalculated,
    tenants,
  } = analysisDetails

  return (
    <div className="-mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {rentableArea > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Areal</CardTitle>
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
            <div className="text-xl font-bold">
              {new Intl.NumberFormat("no-NO").format(rentableArea)} m²
            </div>
            <p className="text-xs text-muted-foreground">
              Totalt areal for eiendommen
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

      {rentPerArea > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pris pr m²</CardTitle>
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
            <div className="text-xl font-bold">
              {new Intl.NumberFormat("no-NO").format(rentPerArea)} NOK/m²
            </div>
            <p className="text-xs text-muted-foreground">
              Leiepris pr kvm for leietakeren
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

      {roiCalculated > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
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
            <div className="text-2xl font-bold">
              {(roiCalculated * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">igjen av leietiden</p>
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

      {tenants.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Antall leietakere
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
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">
              Antall leietakere i eiendommen
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
      {/* <AnalysesScoreBuilding />
      <AnalysesScoreBuilding />
      <AnalysesScoreBuilding />
      <AnalysesScoreBuilding /> */}
    </div>
  )
}
