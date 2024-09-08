"use client";

import { Badge } from "@propdock/ui/components/badge";
import { Button } from "@propdock/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@propdock/ui/components/dropdown-menu";
import { ScrollArea } from "@propdock/ui/components/scroll-area";
import { Separator } from "@propdock/ui/components/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@propdock/ui/components/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@propdock/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@propdock/ui/components/tooltip";
import {
  AlertCircle,
  ArrowUpDown,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  ExternalLink,
  MoreHorizontal,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { formatCurrency } from "@/lib/utils"; // Add this import

// Define the Tenant type based on the provided fields
interface Tenant {
  financialAnalysisBuildingId: string;
  name: string;
  organizationNumber: string | null;
  address: string | null;
  employees: number | null;
  operatingIncome: number | null;
  wagesCosts: number | null;
  totalOperatingCosts: number | null;
  operatingResult: number | null;
  netFinance: number | null;
  resultBeforeTax: number | null;
  rating: "good" | "average" | "poor";
  description: string;
  foundedYear: number;
  industry: string;
  liquidityScore: number;
  lastYearLiquidityScore: number;
}

// Sample data (replace this with your actual data)
const tenants: Tenant[] = [
  {
    financialAnalysisBuildingId: "B001",
    name: "Me Without The Boys AS",
    organizationNumber: "919415754",
    address: "123 Main St, City, Country",
    employees: 50,
    operatingIncome: 1000000,
    wagesCosts: 500000,
    totalOperatingCosts: 750000,
    operatingResult: 250000,
    netFinance: -50000,
    resultBeforeTax: 200000,
    rating: "good",
    description: "A trendsetting company in the entertainment industry.",
    foundedYear: 2015,
    industry: "Entertainment",
    liquidityScore: 0.48,
    lastYearLiquidityScore: 0.55
  },
  {
    financialAnalysisBuildingId: "B002",
    name: "Corponor AS",
    organizationNumber: "969026155",
    address: "456 Tech Ave, Silicon Valley, USA",
    employees: 120,
    operatingIncome: 5000000,
    wagesCosts: 2500000,
    totalOperatingCosts: 3750000,
    operatingResult: 1250000,
    netFinance: -100000,
    resultBeforeTax: 1150000,
    rating: "average",
    description: "A trendsetting company in the entertainment industry.",
    foundedYear: 2015,
    industry: "Entertainment",
    liquidityScore: 0.75,
    lastYearLiquidityScore: 0.68
  },
  {
    financialAnalysisBuildingId: "B003",
    name: "Struggling Enterprise AS",
    organizationNumber: "123456789",
    address: "789 Trouble Lane, Challengeville, Norway",
    employees: 15,
    operatingIncome: 500000,
    wagesCosts: 400000,
    totalOperatingCosts: 550000,
    operatingResult: -50000,
    netFinance: -20000,
    resultBeforeTax: -70000,
    rating: "poor",
    description: "A company facing significant financial challenges.",
    foundedYear: 2018,
    industry: "Retail",
    liquidityScore: 0.25,
    lastYearLiquidityScore: 0.35
  }
  // Add more sample data here...
];

// Add this function to get the badge details
function getTenantRatingBadge(rating: Tenant["rating"]) {
  const badgeConfig = {
    good: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      text: "God"
    },
    average: {
      color: "bg-yellow-100 text-yellow-800",
      icon: AlertCircle,
      text: "Gjennomsnittlig"
    },
    poor: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Dårlig" }
  };

  const config = badgeConfig[rating];
  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1`}
    >
      <config.icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}

// Add this function to calculate the color based on the score
function getScoreColor(score: number): string {
  if (score >= 0.7) {
    return "hsl(var(--chart-2))"; // Green-yellow for 70% and above
  }
  if (score >= 0.3) {
    return "hsl(var(--chart-4))"; // Teal for 30% to 70%
  }
  return "hsl(var(--chart-1))"; // Orange-red for below 30%
}

export default function TenantTableAnalysis() {
  const [sortColumn, setSortColumn] = useState<keyof Tenant | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const sortedTenants = [...tenants].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue === null) {
        return sortDirection === "asc" ? 1 : -1;
      }
      if (bValue === null) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (column: keyof Tenant) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button variant="ghost" onClick={() => handleSort("name")}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Navn
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort("employees")}>
                  <Users className="mr-2 h-4 w-4" />
                  Ansatte
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("operatingIncome")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Driftsinntekter
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <PiggyBank className="mr-2 inline h-4 w-4" />
                Resultat før skatt
              </TableHead>
              <TableHead>Vurdering</TableHead>
              <TableHead className="text-right">Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTenants.map(tenant => (
              <TableRow key={tenant.financialAnalysisBuildingId}>
                <TableCell className="font-medium">
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => setSelectedTenant(tenant)}
                  >
                    {tenant.name}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  {tenant.employees || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tenant.operatingIncome)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(tenant.resultBeforeTax)}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {getTenantRatingBadge(tenant.rating)}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Basert på økonomiske indikatorer og betalingshistorikk
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Åpne meny</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(
                            tenant.financialAnalysisBuildingId
                          )
                        }
                      >
                        Kopier leietaker-ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a
                          href={`https://www.purehelp.no/m/company/details/${tenant.name.toLowerCase().replace(/\s+/g, "")}/${tenant.organizationNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Se detaljer <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Rediger leietaker</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={selectedTenant !== null}
        onOpenChange={() => setSelectedTenant(null)}
      >
        <SheetContent className="sm:max-w-[425px]">
          <SheetHeader>
            <SheetTitle>{selectedTenant?.name}</SheetTitle>
            <SheetDescription>
              Detaljert informasjon om leietakeren
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          {selectedTenant && (
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm leading-none">Bransje</p>
                    <p className="text-muted-foreground text-sm">
                      {selectedTenant.industry}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm leading-none">
                      Grunnlagt
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {selectedTenant.foundedYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm leading-none">Ansatte</p>
                    <p className="text-muted-foreground text-sm">
                      {selectedTenant.employees}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm leading-none">
                      Driftsinntekter
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {formatCurrency(selectedTenant.operatingIncome)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <PiggyBank className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm leading-none">
                      Resultat før skatt
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {formatCurrency(selectedTenant.resultBeforeTax)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm leading-none">
                      Vurdering
                    </p>
                    <div className="mt-1">
                      {getTenantRatingBadge(selectedTenant.rating)}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-2 font-semibold text-lg">
                    Likviditetsscore
                  </h3>
                  <div className="mx-auto w-full max-w-[250px]">
                    <RadialBarChart
                      width={250}
                      height={250}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="80%"
                      barSize={10}
                      data={[
                        {
                          name: "Likviditet",
                          value: selectedTenant.liquidityScore
                        }
                      ]}
                      startAngle={180}
                      endAngle={0}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 1]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                        fill={getScoreColor(selectedTenant.liquidityScore)}
                      />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-foreground font-bold text-3xl"
                      >
                        {selectedTenant.liquidityScore.toFixed(2)}
                      </text>
                    </RadialBarChart>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-medium text-sm">
                      {selectedTenant.liquidityScore >= 0.5 ? (
                        <span className="flex items-center justify-center text-green-600">
                          Økende trend <TrendingUp className="ml-1 h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center text-red-600">
                          Synkende trend{" "}
                          <TrendingDown className="ml-1 h-4 w-4" />
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Sammenlignet med i fjor:{" "}
                      {selectedTenant.lastYearLiquidityScore.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-medium text-sm leading-none">
                    Beskrivelse
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {selectedTenant.description}
                  </p>
                </div>
              </div>
            </ScrollArea>
          )}
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button variant="outline">Lukk</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
