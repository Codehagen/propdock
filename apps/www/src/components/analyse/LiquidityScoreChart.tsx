"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@propdock/ui/components/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

interface LiquidityScoreChartProps {
  score: number;
  lastYearScore: number;
}

const chartConfig = {
  liquidity: {
    label: "Liquidity Score",
    color: "hsl(var(--chart-1))"
  }
} satisfies ChartConfig;

function getScoreColor(score: number): string {
  if (score >= 0.8) {
    return "hsl(var(--chart-good))";
  }
  if (score >= 0.5) {
    return "hsl(var(--chart-average))";
  }
  return "hsl(var(--chart-poor))";
}

export function LiquidityScoreChart({
  score,
  lastYearScore
}: LiquidityScoreChartProps) {
  const chartData = [{ name: "Liquidity", value: score }];
  const trend = score >= lastYearScore ? "up" : "down";
  const trendPercentage = Math.abs(
    ((score - lastYearScore) / lastYearScore) * 100
  ).toFixed(1);

  return (
    <div className="flex flex-col items-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={180}
          endAngle={0}
          innerRadius="60%"
          outerRadius="80%"
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarRadiusAxis
            type="number"
            domain={[0, 1]}
            angleAxisId={0}
            tick={false}
            axisLine={false}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        className="fill-foreground font-bold text-3xl"
                      >
                        {score.toFixed(2)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 15}
                        className="fill-muted-foreground text-sm"
                      >
                        Liquidity Score
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill={getScoreColor(score)}
            background
            clockWise
          />
        </RadialBarChart>
      </ChartContainer>
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 font-medium">
          Trending {trend} by {trendPercentage}%
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="text-muted-foreground text-sm">
          Compared to last year: {lastYearScore.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
