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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@propdock/ui/components/chart"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

const chartData = [
  { month: "Jan", income: 310, expenses: 195 },
  { month: "Feb", income: 325, expenses: 210 },
  { month: "Mar", income: 350, expenses: 230 },
  { month: "Apr", income: 390, expenses: 300 },
  { month: "Mai", income: 425, expenses: 340 },
  { month: "Jun", income: 430, expenses: 350 },
  { month: "Jul", income: 445, expenses: 360 },
  { month: "Aug", income: 460, expenses: 370 },
  { month: "Sep", income: 475, expenses: 380 },
  { month: "Okt", income: 490, expenses: 390 },
  { month: "Nov", income: 505, expenses: 400 },
  { month: "Des", income: 520, expenses: 410 },
]

const chartConfig = {
  income: {
    label: "Inntekt",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Utgifter",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DashboardRevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Økonomisk Oversikt</CardTitle>
        <CardDescription>
          Inntekter vs Utgifter de siste måneder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="expenses"
              fill="var(--color-expenses)"
              fillOpacity={0.4}
              stroke="var(--color-expenses)"
              stackId="a"
            />
            <Area
              type="monotone"
              dataKey="income"
              fill="var(--color-income)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Inntekter øker med 5,2% denne måneden{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
