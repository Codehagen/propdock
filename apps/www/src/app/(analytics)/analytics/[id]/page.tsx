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
import { AnalysisInfoCard } from "@/components/analyse/AnalysisInfoCard"
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
        >
          {/* <Button>
            <Link href={`/analytics/${analysisDetails.id}/edit`}>
              Rediger Analyse
            </Link>
          </Button> */}
        </DashboardHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="inntekt">Inntekt</TabsTrigger>
            <TabsTrigger value="details">Kostnader</TabsTrigger>
            <TabsTrigger value="market-data">Markedsdata</TabsTrigger>
          </TabsList>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="order-2 lg:order-1 lg:col-span-2">
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
                      initialRatioAreaOffice={
                        analysisDetails.ratioAreaOffice ?? 0
                      }
                      initialRatioAreaMerch={
                        analysisDetails.ratioAreaMerch ?? 0
                      }
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
                    initialOwnerCostsMethod={analysisDetails.ownerCostsMethod}
                    initialOwnerCostsManual={
                      analysisDetails.ownerCostsManual ?? 0
                    }
                    initialCostMaintenance={
                      analysisDetails.costMaintenance ?? 0
                    }
                    initialCostInsurance={analysisDetails.costInsurance ?? 0}
                    initialCostRevision={analysisDetails.costRevision ?? 0}
                    initialCostAdm={analysisDetails.costAdm ?? 0}
                    initialCostOther={analysisDetails.costOther ?? 0}
                    initialCostNegotiation={
                      analysisDetails.costNegotiation ?? 0
                    }
                    initialCostLegalFees={analysisDetails.costLegalFees ?? 0}
                    initialCostConsultFees={
                      analysisDetails.costConsultFees ?? 0
                    }
                    initialCostAssetMgmt={analysisDetails.costAssetMgmt ?? 0}
                    initialCostSum={analysisDetails.costSum ?? 0}
                  />
                  <EditROICard
                    analysisId={analysisDetails.id}
                    initialUseCalcROI={analysisDetails.useCalcROI}
                    initialROIWeightedYield={
                      analysisDetails.roiWeightedYield ?? 0
                    }
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
                  initialManYieldWeighted={
                    analysisDetails.manYieldWeighted ?? 0
                  }
                />
              </TabsContent>
            </div>
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-20 lg:self-start">
                <AnalysisInfoCard analysisDetails={analysisDetails} />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <AnalysisDetailsTable details={analysisDetails} />
          </div>
        </Tabs>
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
