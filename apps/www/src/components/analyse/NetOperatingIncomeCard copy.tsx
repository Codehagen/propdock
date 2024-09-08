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

export function NetOperatingIncomeCard() {
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Net Operating Income</CardTitle>
        <CardDescription>
          NOI has increased by 5% compared to the previous quarter.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 font-bold text-3xl tabular-nums leading-none">
          1.2M
          <span className="font-normal text-muted-foreground text-sm">
            NOK/quarter
          </span>
        </div>
        <ChartContainer
          config={{
            noi: {
              label: "NOI",
              color: "hsl(var(--chart-4))"
            }
          }}
          className="ml-auto w-[64px]"
        >
          <BarChart
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={[
              { quarter: "Q1", noi: 1050000 },
              { quarter: "Q2", noi: 1100000 },
              { quarter: "Q3", noi: 1150000 },
              { quarter: "Q4", noi: 1200000 }
            ]}
          >
            <Bar
              dataKey="noi"
              fill="var(--color-noi)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={3}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis dataKey="quarter" hide />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
