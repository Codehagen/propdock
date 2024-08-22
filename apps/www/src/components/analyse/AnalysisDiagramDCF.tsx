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
import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

interface AnalysisDiagramDCFProps {
  details: {
    name: string
    // Add other necessary properties
  }
}

const chartConfig = {
  netIncome: {
    label: "Netto inntekt",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AnalysisDiagramDCF({ details }: AnalysisDiagramDCFProps) {
  // Mock data - replace this with actual data from your analysis
  const chartData = [
    { year: "2024", netIncome: 1000000 },
    { year: "2025", netIncome: 1050000 },
    { year: "2026", netIncome: 1102500 },
    { year: "2027", netIncome: 1157625 },
    { year: "2028", netIncome: 1215506 },
    { year: "2029", netIncome: 1276281 },
    { year: "2030", netIncome: 1340095 },
    { year: "2031", netIncome: 1407100 },
    { year: "2032", netIncome: 1477455 },
  ]

  const averageNetIncome =
    chartData.reduce((sum, item) => sum + item.netIncome, 0) / chartData.length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Netto inntekt prognose</CardTitle>
        <CardDescription>
          Viser forventet netto inntekt for de neste {chartData.length} årene
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            accessibilityLayer
            margin={{
              left: 40,
              right: 40,
              top: 20,
              bottom: 20,
            }}
            data={chartData}
            width={1000}
            height={400}
          >
            <Bar
              dataKey="netIncome"
              fill="var(--color-netIncome)"
              radius={5}
              fillOpacity={0.6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  valueFormatter={(value) => `${value.toLocaleString()} NOK`}
                />
              }
              cursor={false}
            />
            <ReferenceLine
              y={averageNetIncome}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Gjennomsnittlig netto inntekt"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={`${(averageNetIncome / 1000000).toFixed(2)}M NOK`}
                className="text-lg"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Forventet netto inntekt for {chartData[chartData.length - 1]?.year}:{" "}
          <span className="font-medium text-foreground">
            {chartData[chartData.length - 1]?.netIncome.toLocaleString()} NOK
          </span>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Gjennomsnittlig netto inntekt over prognoseperioden:{" "}
          {averageNetIncome.toLocaleString()} NOK
        </div>
      </CardFooter>
    </Card>
  )
}
