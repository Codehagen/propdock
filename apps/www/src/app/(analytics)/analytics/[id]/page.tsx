import Link from "next/link"
import { getAnalysisDetails } from "@/actions/get-analysis-details"
import { Button } from "@propdock/ui/components/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@propdock/ui/components/tabs"
import {
  BarChart2,
  Building2,
  LayoutGrid,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { AnalysisDetailsTable } from "@/components/analyse/AnalysisDetailsTable"
import { AnalysisInfoCard } from "@/components/analyse/AnalysisInfoCard"
import { EditAnalysisNameCard } from "@/components/analyse/EditAnalysisNameCard"
import { EditIncomeCard } from "@/components/analyse/EditIncomeCard"
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
            <TabsTrigger value="overview">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Oversikt
            </TabsTrigger>
            <TabsTrigger value="inntekt">
              <Building2 className="mr-2 h-4 w-4" />
              Inntekt
            </TabsTrigger>

            <TabsTrigger value="details">
              <Wallet className="mr-2 h-4 w-4" />
              Kostnader
            </TabsTrigger>
            <TabsTrigger value="avkastning">
              <BarChart2 className="mr-2 h-4 w-4" />
              Avkastning
            </TabsTrigger>
            <TabsTrigger value="market-data">
              <TrendingUp className="mr-2 h-4 w-4" />
              Markedsdata
            </TabsTrigger>
          </TabsList>
          <div className="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              <TabsContent value="inntekt">
                <EditIncomeCard
                  analysisId={analysisDetails.id}
                  initialAnnualRent={analysisDetails.annualRent ?? 0}
                  initialOtherIncome={analysisDetails.otherIncome ?? 0}
                  incomeUnits={analysisDetails.incomeUnits}
                />
              </TabsContent>
              <TabsContent value="details">
                <div className="">
                  <EditOwnerCostsCard
                    analysisId={analysisDetails.id}
                    initialOwnerCostsMethod={
                      analysisDetails.costs?.ownerCostsMethod ?? false
                    }
                    initialOwnerCostsManual={
                      analysisDetails.costs?.ownerCostsManual ?? 0
                    }
                    initialCostMaintenance={
                      analysisDetails.costs?.costMaintenance ?? 0
                    }
                    initialCostInsurance={
                      analysisDetails.costs?.costInsurance ?? 0
                    }
                    initialCostRevision={
                      analysisDetails.costs?.costRevision ?? 0
                    }
                    initialCostAdm={analysisDetails.costs?.costAdm ?? 0}
                    initialCostOther={analysisDetails.costs?.costOther ?? 0}
                    initialCostNegotiation={
                      analysisDetails.costs?.costNegotiation ?? 0
                    }
                    initialCostLegalFees={
                      analysisDetails.costs?.costLegalFees ?? 0
                    }
                    initialCostConsultFees={
                      analysisDetails.costs?.costConsultFees ?? 0
                    }
                    initialCostAssetMgmt={
                      analysisDetails.costs?.costAssetMgmt ?? 0
                    }
                    initialCostSum={analysisDetails.costs?.costSum ?? 0}
                  />
                </div>
              </TabsContent>
              <TabsContent value="avkastning">
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
