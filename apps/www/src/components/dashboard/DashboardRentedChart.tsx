"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@propdock/ui/components/chart";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

const chartData = [
  { status: "Utleid", value: 70, fill: "hsl(var(--chart-1))" },
  { status: "Ledig", value: 30, fill: "hsl(var(--chart-2))" }
];

const chartConfig = {
  value: {
    label: "Prosent"
  },
  Utleid: {
    label: "Utleid",
    color: "hsl(var(--chart-1))"
  },
  Ledig: {
    label: "Ledig",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;

export function DashboardRentedChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Oversikt utleie </CardTitle>
        <CardDescription>Hvor mye er ledig?</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Økning på 5.2% denne måneden <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Viser oversikt over utleide og ledige eiendommer
        </div>
      </CardFooter>
    </Card>
  );
}
