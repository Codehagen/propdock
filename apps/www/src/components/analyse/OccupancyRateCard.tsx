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

export function OccupancyRateCard() {
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Utleiegrad</CardTitle>
        <CardDescription>
          Eiendommens utleiegrad har vært stabil de siste 6 månedene.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 font-bold text-3xl tabular-nums leading-none">
          95%
          <span className="font-normal text-muted-foreground text-sm">
            Utleiegrad
          </span>
        </div>
        <ChartContainer
          config={{
            occupancy: {
              label: "Occupancy",
              color: "hsl(var(--chart-3))"
            }
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={[
              { month: "Feb", occupancy: 94 },
              { month: "Mar", occupancy: 93 },
              { month: "Apr", occupancy: 95 },
              { month: "May", occupancy: 96 },
              { month: "Jun", occupancy: 94 },
              { month: "Jul", occupancy: 95 }
            ]}
          >
            <Bar
              dataKey="occupancy"
              fill="var(--color-occupancy)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={5}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis dataKey="month" hide />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
