import Link from "next/link"
import { getAnalysisDetails } from "@/actions/get-analysis-details"

import { Button } from "@dingify/ui/components/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@dingify/ui/components/tabs"

import { AnalysisDetailsTable } from "@/components/analyse/AnalysisDetailsTable"
import { EditAnalysisNameCard } from "@/components/analyse/EditAnalysisNameCard"
import { EditKpiCard } from "@/components/analyse/EditKpiCard.tsx"
import { EditMarketDataCard } from "@/components/analyse/EditMarketDataCard"
import { EditOwnerCostsCard } from "@/components/analyse/EditOwnerCostsCard"
import { EditRentableAreaCard } from "@/components/analyse/EditRentableAreaCard"
import { EditROICard } from "@/components/analyse/EditROICard"
import { EditVacancyCard } from "@/components/analyse/EditVacancyCard"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export default async function AnalysisDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const analysisId = params.id

  try {
    const { success, analysisDetails, error } =
      await getAnalysisDetails(analysisId)

    if (!success || !analysisDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Analyse ikke funnet"
            text="Vi kunne ikke finne analysen du leter etter."
          />
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={analysisDetails.name}
          text="Detaljer om analysen."
        ></DashboardHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="details">Detaljer</TabsTrigger>
            <TabsTrigger value="market-data">Markedsdata</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <EditAnalysisNameCard
                  analysisId={analysisDetails.id}
                  initialName={analysisDetails.name}
                  initialDate={analysisDetails.appreciationDate}
                />
                <EditRentableAreaCard
                  analysisId={analysisDetails.id}
                  initialRentableArea={analysisDetails.rentableArea}
                  initialRatioAreaOffice={analysisDetails.ratioAreaOffice ?? 0}
                  initialRatioAreaMerch={analysisDetails.ratioAreaMerch ?? 0}
                  initialRatioAreaMisc={analysisDetails.ratioAreaMisc ?? 0}
                />
              </div>
              <div className="space-y-6">
                <EditKpiCard
                  analysisId={analysisDetails.id}
                  initialKpi1={analysisDetails.kpi1}
                  initialKpi2={analysisDetails.kpi2}
                  initialKpi3={analysisDetails.kpi3}
                  initialKpi4={analysisDetails.kpi4}
                />
                <EditVacancyCard
                  analysisId={analysisDetails.id}
                  initialVacancyPerYear={
                    analysisDetails.vacancyPerYear ?? ({} as any)
                  }
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <EditOwnerCostsCard
                analysisId={analysisDetails.id}
                initialOwnerCostsMethod={analysisDetails.costs.ownerCostsMethod}
                initialOwnerCostsManual={analysisDetails.costs.ownerCostsManual}
                initialCostMaintenance={analysisDetails.costs.costMaintenance}
                initialCostInsurance={analysisDetails.costs.costInsurance}
                initialCostRevision={analysisDetails.costs.costRevision}
                initialCostAdm={analysisDetails.costs.costAdm}
                initialCostOther={analysisDetails.costs.costOther}
                initialCostNegotiation={analysisDetails.costs.costNegotiation}
                initialCostLegalFees={analysisDetails.costs.costLegalFees}
                initialCostConsultFees={analysisDetails.costs.costConsultFees}
                initialCostAssetMgmt={analysisDetails.costs.costAssetMgmt}
                initialCostSum={analysisDetails.costs.costSum}
              />
              <EditROICard
                analysisId={analysisDetails.id}
                initialUseCalcROI={analysisDetails.useCalcROI}
                initialROIWeightedYield={analysisDetails.roiWeightedYield ?? 0}
                initialROIInflation={analysisDetails.roiInflation ?? 0}
                initialROICalculated={analysisDetails.roiCalculated ?? 0}
                initialROIManual={analysisDetails.roiManual ?? 0}
              />
            </div>
          </TabsContent>
          <TabsContent value="market-data">
            <EditMarketDataCard
              analysisId={analysisDetails.id}
              initialMarketRentOffice={analysisDetails.marketRentOffice}
              initialMarketRentMerch={analysisDetails.marketRentMerch}
              initialMarketRentMisc={analysisDetails.marketRentMisc}
              initialUsePrimeYield={analysisDetails.usePrimeYield}
              initialManYieldOffice={analysisDetails.manYieldOffice ?? 0}
              initialManYieldMerch={analysisDetails.manYieldMerch ?? 0}
              initialManYieldMisc={analysisDetails.manYieldMisc ?? 0}
              initialManYieldWeighted={analysisDetails.manYieldWeighted ?? 0}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-8">
          <AnalysisDetailsTable details={analysisDetails} />
        </div>
      </DashboardShell>
    )
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Feil" text={error.message} />
      </DashboardShell>
    )
  }
}
