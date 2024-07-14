import Link from "next/link"
import { getAnalysisDetails } from "@/actions/get-analysis-details"

import { Button } from "@dingify/ui/components/button"

import { AnalysisTableDCF } from "@/components/analyse/AnalysisTableDCF"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export default async function DCFDetailsPage({
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
        ></DashboardHeader>
        <div className="mt-4 space-y-4">
          <AnalysisTableDCF details={analysisDetails} />
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
