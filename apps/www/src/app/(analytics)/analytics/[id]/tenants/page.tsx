import { getAnalysisDetails } from "@/actions/get-analysis-details";

import { SensitivityAnalysisTable } from "@/components/analyse/SensitivityAnalysisTable";
import TenantTableAnalysis from "@/components/analyse/TenantTableAnalysis";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function SensitivityAnalysisPage({
  params
}: {
  params: { id: string };
}) {
  const analysisId = params.id;

  try {
    const { success, analysisDetails, error } =
      await getAnalysisDetails(analysisId);
    console.log(analysisDetails);

    if (!success || !analysisDetails) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Analysis not found"
            text="We couldn't find the analysis you're looking for."
          />
        </DashboardShell>
      );
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={`Leietakere for ${analysisDetails.name}`}
          text="Analyse av leietakere."
        />
        <div className="mt-4 space-y-4">
          <TenantTableAnalysis />
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
