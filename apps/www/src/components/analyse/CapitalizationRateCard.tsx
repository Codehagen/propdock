"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import { ChartContainer } from "@propdock/ui/components/chart";
import { Bar, BarChart, Rectangle, XAxis } from "recharts";

export function CapitalizationRateCard() {
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Yield</CardTitle>
        <CardDescription>Kalkulert yield for denne eiendommen </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 font-bold text-3xl tabular-nums leading-none">
          6.8%
          <span className="font-normal text-muted-foreground text-sm">
            Yield
          </span>
        </div>
        <ChartContainer
          config={{
            capRate: {
              label: "Cap Rate",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={[
              { date: "2024-01", capRate: 6.2 },
              { date: "2024-02", capRate: 6.3 },
              { date: "2024-03", capRate: 6.4 },
              { date: "2024-04", capRate: 6.5 },
              { date: "2024-05", capRate: 6.6 },
              { date: "2024-06", capRate: 6.7 },
              { date: "2024-07", capRate: 6.8 },
            ]}
          >
            <Bar
              dataKey="capRate"
              fill="var(--color-capRate)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis dataKey="date" hide />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
