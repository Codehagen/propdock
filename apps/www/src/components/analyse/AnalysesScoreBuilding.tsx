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

export default function AnalysesScoreBuilding() {
  return (
    <Card className="">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Active Energy</CardTitle>
        <CardDescription>
          You're burning an average of 754 calories per day. Good job!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 font-bold text-3xl tabular-nums leading-none">
          1,254
          <span className="font-normal text-muted-foreground text-sm">
            kcal/day
          </span>
        </div>
        <ChartContainer
          config={{
            calories: {
              label: "Calories",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            data={[
              {
                date: "2024-01-01",
                calories: 354,
              },
              {
                date: "2024-01-02",
                calories: 514,
              },
              {
                date: "2024-01-03",
                calories: 345,
              },
              {
                date: "2024-01-04",
                calories: 734,
              },
              {
                date: "2024-01-05",
                calories: 645,
              },
              {
                date: "2024-01-06",
                calories: 456,
              },
              {
                date: "2024-01-07",
                calories: 345,
              },
            ]}
          >
            <Bar
              dataKey="calories"
              fill="var(--color-calories)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
