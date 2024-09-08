"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@propdock/ui/components/chart";
import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

const tenantData = [
  { sector: "Kontor", value: 40, fill: "var(--color-kontor)" },
  { sector: "Handel", value: 30, fill: "var(--color-handel)" },
  { sector: "Industri", value: 20, fill: "var(--color-industri)" },
  { sector: "Annet", value: 10, fill: "var(--color-annet)" },
];

const chartConfig = {
  tenantDiversity: {
    label: "Leietaker Diversitet",
  },
  kontor: {
    label: "Kontor",
    color: "hsl(var(--chart-1))",
  },
  handel: {
    label: "Handel",
    color: "hsl(var(--chart-2))",
  },
  industri: {
    label: "Industri",
    color: "hsl(var(--chart-3))",
  },
  annet: {
    label: "Annet",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function TenantDiversificationCard() {
  const largestSector = tenantData.reduce((prev, current) =>
    prev.value > current.value ? prev : current,
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Leietaker Diversifisering</CardTitle>
        <CardDescription>
          Fordeling av leietakere på tvers av sektorer
        </CardDescription>
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
              data={tenantData}
              dataKey="value"
              nameKey="sector"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {tenantData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`var(--color-${entry.sector.toLowerCase()})`}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Største sektor: {largestSector.sector} ({largestSector.value}%)
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Viser fordeling av leietakere etter sektor
        </div>
      </CardFooter>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {tenantData.map((sector) => (
            <div key={sector.sector} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: `var(--color-${sector.sector.toLowerCase()})`,
                }}
              />
              <span>{sector.sector}</span>
              <span className="ml-auto font-medium">{sector.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
