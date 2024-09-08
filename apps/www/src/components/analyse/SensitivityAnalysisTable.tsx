import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@propdock/ui/components/table";

interface SensitivityAnalysisTableProps {
  analysis: {
    sumValueNow: number;
    costs: {
      costSum: number;
    };
    [key: string]: any;
  };
}

export function SensitivityAnalysisTable({
  analysis
}: SensitivityAnalysisTableProps) {
  /**
   * Developer Note: Sensitivity Analysis Calculation
   *
   * This function calculates the Return on Cost (RoC) for different scenarios
   * of changes in build costs and Gross Development Value (GDV).
   *
   * The calculation process is as follows:
   * 1. Base values:
   *    - Base Build Costs = analysis.costSum
   *    - Base GDV = analysis.sumValueNow
   *
   * 2. Adjustments:
   *    - Adjusted Build Costs = Base Build Costs * (1 + buildCostsChange / 100)
   *    - Adjusted GDV = Base GDV * (1 + gdvChange / 100)
   *
   * 3. Profit calculation:
   *    Profit = Adjusted GDV - Adjusted Build Costs
   *
   * 4. Return on Cost (RoC) calculation:
   *    RoC = (Profit / Adjusted Build Costs) * 100
   *
   * 5. The result is rounded to one decimal place and returned as a string.
   *
   * This calculation allows us to see how the RoC changes with different
   * scenarios of build cost and GDV fluctuations, providing insight into
   * the project's sensitivity to these factors.
   */
  const calculateSensitivity = (
    buildCostsChange: number,
    gdvChange: number
  ) => {
    const baseBuildCosts = analysis.costs.costSum;
    const baseGDV = analysis.sumValueNow;

    const adjustedBuildCosts = baseBuildCosts * (1 + buildCostsChange / 100);
    const adjustedGDV = baseGDV * (1 + gdvChange / 100);

    const profit = adjustedGDV - adjustedBuildCosts;
    const roc = (profit / adjustedBuildCosts) * 100;

    return roc.toFixed(1);
  };

  const buildCostsRange = [-20, -10, 0, 10, 20];
  const gdvRange = [-20, -10, 0, 10, 20];

  const getCellColor = (value: string) => {
    const numValue = Number.parseFloat(value);
    if (numValue < 0) {
      return "bg-red-200";
    }
    if (numValue < 10) {
      return "bg-yellow-200";
    }
    if (numValue < 20) {
      return "bg-green-100";
    }
    return "bg-green-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensitivitetsanalyse: {analysis.name}</CardTitle>
        <CardDescription>Avkastning på kostnad (%)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Build costs</TableHead>
              {gdvRange.map(gdv => (
                <TableHead key={gdv} className="text-center">
                  GDV {gdv > 0 ? "+" : ""}
                  {gdv}%
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildCostsRange.map(buildCosts => (
              <TableRow key={buildCosts}>
                <TableCell className="font-medium">
                  {buildCosts > 0 ? "+" : ""}
                  {buildCosts}%
                </TableCell>
                {gdvRange.map(gdv => {
                  const value = calculateSensitivity(buildCosts, gdv);
                  return (
                    <TableCell
                      key={gdv}
                      className={`text-center ${getCellColor(value)}`}
                    >
                      {value}%
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
