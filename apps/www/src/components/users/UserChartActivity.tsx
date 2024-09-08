"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { nFormatter } from "@/lib/utils";

const lineChartData = [
  { month: "Jan", revenue: 400000, costs: 240000 },
  { month: "Feb", revenue: 300000, costs: 139000 },
  { month: "Mar", revenue: 200000, costs: 98000 },
  { month: "Apr", revenue: 278000, costs: 39000 },
  { month: "Mai", revenue: 189000, costs: 48000 },
  { month: "Jun", revenue: 239000, costs: 38000 },
  { month: "Jul", revenue: 349000, costs: 43000 },
  { month: "Aug", revenue: 430000, costs: 21000 },
  { month: "Sep", revenue: 480000, costs: 34000 },
  { month: "Okt", revenue: 390000, costs: 46000 },
  { month: "Nov", revenue: 139000, costs: 22000 },
  { month: "Des", revenue: 240000, costs: 19000 }
];

// Add net income to each data point
lineChartData.forEach(data => {
  data.netIncome = data.revenue - data.costs;
});

export function UserChartActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inntekter og Kostnader Over Tid</CardTitle>
        <CardDescription>
          Sporing av inntekter og kostnader per måned.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0
              }}
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] text-muted-foreground uppercase">
                            {payload[0]?.payload.month}
                          </span>
                          <span className="font-bold">
                            Inntekter: {nFormatter(payload[0]?.payload.revenue)}
                          </span>
                          <span className="font-bold">
                            Kostnader: {nFormatter(payload[0]?.payload.costs)}
                          </span>
                          <span className="font-bold">
                            Netto Inntekt:{" "}
                            {nFormatter(payload[0]?.payload.netIncome)}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                strokeWidth={2}
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="costs"
                strokeWidth={2}
                stroke="#82ca9d"
              />
              <Line
                type="monotone"
                dataKey="netIncome"
                strokeWidth={2}
                stroke="#ff7300"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
