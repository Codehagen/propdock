import { AnalystCardsSection } from "./AnalystCardsSection";
import { AnalystMainSection } from "./AnalystMainSection";
import { AnalystNavTop } from "./AnalystNavTop";

export function AnalystDashboardCard({ analysisDetails }) {
  return (
    <div className="space-y-4">
      <AnalystNavTop analysisDetails={analysisDetails} />
      <AnalystCardsSection analysisDetails={analysisDetails} />
      <AnalystMainSection analysisDetails={analysisDetails} />
    </div>
  );
}
