import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import { BarChart, Calendar, PieChart, TrendingUp } from "lucide-react"

import { EmptyPlaceholder } from "../shared/empty-placeholder"

export function AnalystCardsSection({ analysisDetails }) {
  const totalDataPoints = analysisDetails.dataPoints || 0
  const averageScore = analysisDetails.averageScore || 0
  const lastUpdated = analysisDetails.lastUpdated
    ? new Date(analysisDetails.lastUpdated)
    : null
  const trendPercentage = analysisDetails.trendPercentage || 0

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {totalDataPoints > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Data Points
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDataPoints}</div>
            <p className="text-xs text-muted-foreground">
              Analyzed in this report
            </p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="search" />
          <EmptyPlaceholder.Title>No Data Points</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            There are no data points recorded for this analysis.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}

      {averageScore > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Overall analysis score
            </p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="user" />
          <EmptyPlaceholder.Title>No Average Score</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            There is no average score calculated for this analysis.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}

      {lastUpdated ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastUpdated.toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Date of last analysis update
            </p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="user" />
          <EmptyPlaceholder.Title>No Update Date</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            There is no last update date recorded for this analysis.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}

      {trendPercentage !== 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trendPercentage > 0 ? "+" : ""}
              {trendPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              Change from previous period
            </p>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="min-h-[100px]">
          <EmptyPlaceholder.Icon name="search" />
          <EmptyPlaceholder.Title>No Trend Data</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            There is no trend data available for this analysis.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  )
}
