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
  ChartTooltip,
  ChartTooltipContent,
} from "@propdock/ui/components/chart"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

const chartData = [
  { month: "Jan", income: 310, expenses: 195 },
  { month: "Feb", income: 325, expenses: 210 },
  { month: "Mar", income: 350, expenses: 230 },
  { month: "Apr", income: 390, expenses: 300 },
  { month: "Mai", income: 425, expenses: 340 },
  { month: "Jun", income: 430, expenses: 600 },
  { month: "Jul", income: 445, expenses: 360 },
  { month: "Aug", income: 460, expenses: 370 },
  { month: "Sep", income: 475, expenses: 500 },
  { month: "Okt", income: 490, expenses: 390 },
  { month: "Nov", income: 505, expenses: 400 },
  { month: "Des", income: 520, expenses: 410 },
]

const chartConfig = {
  income: {
    label: "Inntekt",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Utgifter",
    color: "hsl(var(--chart-1))",
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
          <LineChart
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="natural"
              dataKey="expenses"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-expenses)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              type="natural"
              dataKey="income"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-income)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Inntekter øker med 5,2% denne måneden{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Viser totale inntekter og utgifter for de siste 12 måneder
        </div>
      </CardFooter>
    </Card>
  )
}
