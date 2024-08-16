import Link from "next/link"
import { getAnalysisDetails } from "@/actions/get-analysis-details"

import { Button } from "@dingify/ui/components/button"

import { SensitivityAnalysisTable } from "@/components/analyse/SensitivityAnalysisTable"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export default async function SensitivityAnalysisPage({
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
          heading={`Sensitivity Analysis: ${analysisDetails.name}`}
          text="Details of the sensitivity analysis."
        ></DashboardHeader>
        <div className="mt-4 space-y-4">
          <SensitivityAnalysisTable analysis={analysisDetails} />
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
