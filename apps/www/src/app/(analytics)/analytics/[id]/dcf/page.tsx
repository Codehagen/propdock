import { getAnalysisDetails } from "@/actions/get-analysis-details";
import { Button } from "@propdock/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@propdock/ui/components/tabs";
import Link from "next/link";

import { AnalysisDiagramDCF } from "@/components/analyse/AnalysisDiagramDCF";
import { AnalysisTableDCF } from "@/components/analyse/AnalysisTableDCF";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DCFDetailsPage({
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
          heading={analysisDetails.name}
          text="Detaljer om analysen."
        />
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Tabell</TabsTrigger>
            <TabsTrigger value="diagram">Diagram</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <div className="mt-4 space-y-4">
              <AnalysisTableDCF details={analysisDetails} />
            </div>
          </TabsContent>
          <TabsContent value="diagram">
            <div className="mt-4 space-y-4">
              <AnalysisDiagramDCF details={analysisDetails} />
            </div>
          </TabsContent>
        </Tabs>
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
