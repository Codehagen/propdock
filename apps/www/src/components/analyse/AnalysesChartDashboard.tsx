"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import type { ChartConfig } from "@propdock/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@propdock/ui/components/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { year: "2021", value: 1000000 },
  { year: "2022", value: 1200000 },
  { year: "2023", value: 1500000 },
  { year: "2024", value: 1800000 },
];

const expenseData = [
  { year: "2021", value: 800000 },
  { year: "2022", value: 950000 },
  { year: "2023", value: 1100000 },
  { year: "2024", value: 1300000 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AnalysesChartDashboard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChartCard
        title="Driftsinntekter"
        data={revenueData}
        config={chartConfig.revenue}
        trend={{ value: 20, isPositive: true }}
      />
      <ChartCard
        title="Driftskostnader"
        data={expenseData}
        config={chartConfig.expenses}
        trend={{ value: 18, isPositive: false }}
      />
    </div>
  );
}

interface ChartCardProps {
  title: string;
  data: { year: string; value: number }[];
  config: { label: string; color: string };
  trend: { value: number; isPositive: boolean };
}

function ChartCard({ title, data, config, trend }: ChartCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <TrendIcon trend={trend} />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value / 1000000}M`}
                domain={["auto", "dataMax + 200000"]}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient
                  id={`fill${config.label}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.color}
                fill={`url(#fill${config.label})`}
                fillOpacity={0.4}
                dot={{ fill: config.color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend.isPositive ? "Økt" : "Redusert"} {title.toLowerCase()} med{" "}
              {trend.value}% i 2024
            </div>
            <div className="flex items-center gap-2 text-muted-foreground leading-none">
              Sammenligning av {title.toLowerCase()} de siste årene
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function TrendIcon({
  trend,
}: {
  trend: { value: number; isPositive: boolean };
}) {
  const Icon = trend.isPositive ? TrendingUp : TrendingDown;
  const colorClass = trend.isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <Icon className="h-5 w-5" />
      <span className="font-medium text-sm">{trend.value}%</span>
    </div>
  );
}
