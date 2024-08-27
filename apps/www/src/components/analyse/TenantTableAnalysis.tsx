"use client"

import { useState } from "react"
import { Badge } from "@propdock/ui/components/badge"
import { Button } from "@propdock/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@propdock/ui/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@propdock/ui/components/tooltip"
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  CheckCircle,
  DollarSign,
  ExternalLink,
  MoreHorizontal,
  PiggyBank,
  Users,
  XCircle,
} from "lucide-react"

import { formatCurrency } from "@/lib/utils" // Add this import

// Define the Tenant type based on the provided fields
interface Tenant {
  financialAnalysisBuildingId: string
  name: string
  organizationNumber: string | null
  address: string | null
  employees: number | null
  operatingIncome: number | null
  wagesCosts: number | null
  totalOperatingCosts: number | null
  operatingResult: number | null
  netFinance: number | null
  resultBeforeTax: number | null
  rating: "good" | "average" | "poor"
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
  },
  // Add more sample data here...
]

// Add this function to get the badge details
function getTenantRatingBadge(rating: Tenant["rating"]) {
  const badgeConfig = {
    good: {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      text: "God",
    },
    average: {
      color: "bg-yellow-100 text-yellow-800",
      icon: AlertCircle,
      text: "Gjennomsnittlig",
    },
    poor: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Dårlig" },
  }

  const config = badgeConfig[rating]
  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1`}
    >
      <config.icon className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

export default function TenantTableAnalysis() {
  const [sortColumn, setSortColumn] = useState<keyof Tenant | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const sortedTenants = [...tenants].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]
      if (aValue === null) return sortDirection === "asc" ? 1 : -1
      if (bValue === null) return sortDirection === "asc" ? -1 : 1
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  const handleSort = (column: keyof Tenant) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

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
            {sortedTenants.map((tenant) => (
              <TableRow key={tenant.financialAnalysisBuildingId}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
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
                            tenant.financialAnalysisBuildingId,
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
    </div>
  )
}
