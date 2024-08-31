import { UserChartActivity } from "../users/UserChartActivity"
import { AnalysesChartDashboard } from "./AnalysesChartDashboard"
import AnalysesRaitingBuilding from "./AnalysesRaitingBuilding"
import AnalysesScoreBuilding from "./AnalysesScoreBuilding"
import { PropertyValueTrendCard } from "./PropertyValueTrendCard"
import { TenantDiversificationCard } from "./TenantDiversificationCard"

export function AnalystMainSection({ analysisDetails }) {
  return (
    <div className="">
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <AnalysesChartDashboard />
          <PropertyValueTrendCard />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <AnalysesRaitingBuilding analysisDetails={analysisDetails} />
          {/* <UserChartActivity /> */}
          {/* <UserChartActivity /> */}
          <TenantDiversificationCard />

          {/* <UserGridActivity dings={tenantDetails.events} /> */}
        </div>
      </div>
    </div>
  )
}
