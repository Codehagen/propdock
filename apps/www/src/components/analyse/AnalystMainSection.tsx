import { UserChartActivity } from "../users/UserChartActivity"
import { AnalysesChartDashboard } from "./AnalysesChartDashboard"
import AnalysesScoreBuilding from "./AnalysesScoreBuilding"

export function AnalystMainSection({ analysisDetails }) {
  return (
    <div className="">
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <AnalysesChartDashboard />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <UserChartActivity />
          <UserChartActivity />
          <AnalysesScoreBuilding />

          {/* <UserGridActivity dings={tenantDetails.events} /> */}
        </div>
      </div>
    </div>
  )
}
