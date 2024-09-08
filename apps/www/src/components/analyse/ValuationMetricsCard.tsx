"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import { ChartContainer } from "@propdock/ui/components/chart";
import { Bar, BarChart, Rectangle, XAxis } from "recharts";

export function ValuationMetricsCard() {
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Verdivurderingsmetrikk</CardTitle>
        <CardDescription>
          Nøkkeltall for vurderingen viser positiv trend.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 font-bold text-3xl tabular-nums leading-none">
          7.2
          <span className="font-normal text-muted-foreground text-sm">
            multiplikator
          </span>
        </div>
        <ChartContainer
          config={{
            multiplikator: {
              label: "Multiplikator",
              color: "hsl(var(--chart-1))"
            }
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={[
              { kvartal: "Q1", multiplikator: 354 },
              { kvartal: "Q2", multiplikator: 514 },
              { kvartal: "Q3", multiplikator: 345 },
              { kvartal: "Q4", multiplikator: 734 },
              { kvartal: "Q1", multiplikator: 645 }
            ]}
          >
            <Bar
              dataKey="multiplikator"
              fill="var(--color-multiplikator)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={4}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis dataKey="kvartal" hide />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
