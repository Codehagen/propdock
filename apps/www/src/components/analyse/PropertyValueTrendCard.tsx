"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@propdock/ui/components/chart"
import { TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { formatCurrency } from "@/lib/utils"

const historicalData = [
  { date: "2023-01", value: 10000000 },
  { date: "2023-04", value: 10200000 },
  { date: "2023-07", value: 10500000 },
  { date: "2023-10", value: 10800000 },
  { date: "2024-01", value: 11200000 },
  { date: "2024-04", value: 11500000 },
  { date: "2024-07", value: 12000000 },
]

const projectedData = [
  { date: "2024-07", value: 12000000 },
  { date: "2025-01", value: 12500000 },
  { date: "2026-01", value: 13500000 },
  { date: "2027-01", value: 14500000 },
  { date: "2028-01", value: 15500000 },
  { date: "2029-01", value: 16500000 },
  { date: "2030-01", value: 17500000 },
  { date: "2031-01", value: 18500000 },
  { date: "2032-01", value: 19500000 },
  { date: "2033-01", value: 20500000 },
  { date: "2034-01", value: 21500000 },
]

const combinedData = [...historicalData, ...projectedData.slice(1)]

export function PropertyValueTrendCard() {
  const currentValue = historicalData[historicalData.length - 1].value
  const projectedValue = projectedData[projectedData.length - 1].value
  const averageValue =
    historicalData.reduce((sum, item) => sum + item.value, 0) /
    historicalData.length
  const growthPercentage = (
    (currentValue / historicalData[0].value - 1) *
    100
  ).toFixed(1)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Eiendomsverdi</CardTitle>
        <TrendIcon
          trend={{ value: parseFloat(growthPercentage), isPositive: true }}
        />
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            propertyValue: {
              label: "Eiendomsverdi",
              color: "hsl(var(--chart-2))",
            },
            projectedValue: {
              label: "Projisert verdi",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <AreaChart
            width={600}
            height={300}
            data={combinedData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-propertyValue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-propertyValue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).getFullYear()}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `${value / 1000000}M`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("nb-NO", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  valueFormatter={(value) => formatCurrency(value)}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-propertyValue)"
              fillOpacity={0.4}
              fill="url(#colorValue)"
              dot={{ fill: "var(--color-propertyValue)", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              data={projectedData}
              stroke="var(--color-projectedValue)"
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
            <ReferenceLine
              y={averageValue}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: "Gjennomsnittlig verdi",
                position: "insideBottomLeft",
                fill: "hsl(var(--foreground))",
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Økt eiendomsverdi med {growthPercentage}% siden{" "}
              {new Date(historicalData[0].date).getFullYear()}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Nåværende verdi: {formatCurrency(currentValue)}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Stipulert verdi om 10 år: {formatCurrency(projectedValue)}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

function TrendIcon({
  trend,
}: {
  trend: { value: number; isPositive: boolean }
}) {
  const colorClass = trend.isPositive ? "text-green-500" : "text-red-500"

  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <TrendingUp className="h-5 w-5" />
      <span className="text-sm font-medium">{trend.value}%</span>
    </div>
  )
}
