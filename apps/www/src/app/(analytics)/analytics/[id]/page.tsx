import Link from "next/link"
import { getAnalysisDetails } from "@/actions/get-analysis-details"

import { Button } from "@dingify/ui/components/button"

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
    console.log(analysisDetails)

    if (!success || !analysisDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Analysis not found"
            text="We couldn't find the analysis you're looking for."
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
          <Button>
            <Link href={`/analytics/${analysisDetails.id}/edit`}>
              Edit Analysis
            </Link>
          </Button>
        </DashboardHeader>
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
          <div className="space-y-6">
            <EditOwnerCostsCard
              analysisId={analysisDetails.id}
              initialOwnerCostsMethod={analysisDetails.ownerCostsMethod}
              initialOwnerCostsManual={analysisDetails.ownerCostsManual ?? 0}
              initialCostMaintenance={analysisDetails.costMaintenance ?? 0}
              initialCostInsurance={analysisDetails.costInsurance ?? 0}
              initialCostRevision={analysisDetails.costRevision ?? 0}
              initialCostAdm={analysisDetails.costAdm ?? 0}
              initialCostOther={analysisDetails.costOther ?? 0}
              initialCostNegotiation={analysisDetails.costNegotiation ?? 0}
              initialCostLegalFees={analysisDetails.costLegalFees ?? 0}
              initialCostConsultFees={analysisDetails.costConsultFees ?? 0}
              initialCostAssetMgmt={analysisDetails.costAssetMgmt ?? 0}
              initialCostSum={analysisDetails.costSum ?? 0}
            />
            <EditROICard
              analysisId={analysisDetails.id}
              initialUseCalcROI={analysisDetails.useCalcROI}
              initialROIWeightedYield={analysisDetails.roiWeightedYield ?? 0}
              initialROIInflation={analysisDetails.roiInflation ?? 0}
              initialROICalculated={analysisDetails.roiCalculated ?? 0}
              initialROIManual={analysisDetails.roiManual ?? 0}
            />
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
          </div>
        </div>
        <div className="mt-8">
          <AnalysisDetailsTable details={analysisDetails} />
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
