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

interface SensitivityAnalysisTableProps {
  details: any
}

export function SensitivityAnalysisTable({
  details,
}: SensitivityAnalysisTableProps) {
  // This is a placeholder function. You'll need to implement the actual calculation logic.
  const calculateSensitivity = (buildCosts: number, gdv: number) => {
    // Placeholder calculation
    return ((buildCosts + gdv) / 100).toFixed(0) + "%"
  }

  const buildCostsRange = [-20, -10, 0, 10, 20]
  const gdvRange = [-20, -10, 0, 10, 20]

  const getCellColor = (value: string) => {
    const numValue = parseFloat(value)
    if (numValue < 0) return "bg-red-200"
    if (numValue < 10) return "bg-yellow-200"
    if (numValue < 20) return "bg-green-100"
    return "bg-green-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensitivity Analysis</CardTitle>
        <CardDescription>Return on Cost</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Build costs</TableHead>
              {gdvRange.map((gdv) => (
                <TableHead key={gdv} className="text-center">
                  {gdv}%
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildCostsRange.map((buildCosts) => (
              <TableRow key={buildCosts}>
                <TableCell className="font-medium">{buildCosts}%</TableCell>
                {gdvRange.map((gdv) => {
                  const value = calculateSensitivity(buildCosts, gdv)
                  return (
                    <TableCell
                      key={gdv}
                      className={`text-center ${getCellColor(value)}`}
                    >
                      {value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
