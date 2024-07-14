import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dingify/ui/components/table"

interface AnalysisDetailsTableProps {
  details: any
}

export function AnalysisDetailsTable({ details }: AnalysisDetailsTableProps) {
  const tableHeaders = ["Field", "Value"]

  const formatValue = (value: any) => {
    if (value instanceof Date) {
      return format(value, "yyyy-MM-dd")
    }
    return value
  }

  const dataRows = [
    { label: "Building", value: details.building.name },
    { label: "Rentable Area", value: details.rentableArea },
    { label: "Rent Per Area", value: details.rentPerArea },
    { label: "Sum Value Now", value: details.sumValueNow },
    { label: "Sum Value Exit", value: details.sumValueExit },
    {
      label: "Appreciation Date",
      value: formatValue(details.appreciationDate),
    },
    { label: "Last Day of Year", value: formatValue(details.lastDayOfYear) },
    { label: "Last Balance Date", value: formatValue(details.lastBalanceDate) },
    {
      label: "Vacancy Per Year",
      value: JSON.stringify(details.vacancyPerYear),
    },
    {
      label: "Owner Costs Method",
      value: details.ownerCostsMethod ? "True" : "False",
    },
    { label: "Owner Costs Manual", value: details.ownerCostsManual },
    { label: "Cost Maintenance", value: details.costMaintenance },
    { label: "Cost Insurance", value: details.costInsurance },
    { label: "Cost Revision", value: details.costRevision },
    { label: "Cost Adm", value: details.costAdm },
    { label: "Cost Other", value: details.costOther },
    { label: "Cost Negotiation", value: details.costNegotiation },
    { label: "Cost Legal Fees", value: details.costLegalFees },
    { label: "Cost Consult Fees", value: details.costConsultFees },
    { label: "Cost Asset Mgmt", value: details.costAssetMgmt },
    { label: "Cost Sum", value: details.costSum },
    { label: "Use Calc ROI", value: details.useCalcROI ? "True" : "False" },
    { label: "ROI Weighted Yield", value: details.roiWeightedYield },
    { label: "ROI Inflation", value: details.roiInflation },
    { label: "ROI Calculated", value: details.roiCalculated },
    { label: "ROI Manual", value: details.roiManual },
    { label: "Market Rent Office", value: details.marketRentOffice },
    { label: "Market Rent Merch", value: details.marketRentMerch },
    { label: "Market Rent Misc", value: details.marketRentMisc },
    {
      label: "Use Prime Yield",
      value: details.usePrimeYield ? "True" : "False",
    },
    { label: "Manual Yield Office", value: details.manYieldOffice },
    { label: "Manual Yield Merch", value: details.manYieldMerch },
    { label: "Manual Yield Misc", value: details.manYieldMisc },
    { label: "Manual Yield Weighted", value: details.manYieldWeighted },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Details</CardTitle>
        <CardDescription>All details about the analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{formatValue(row.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
