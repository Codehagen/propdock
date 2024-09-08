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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@propdock/ui/components/tooltip";
import { differenceInDays } from "date-fns";

interface AnalysisTableDCFProps {
  details: {
    rentableArea: number;
    rentPerArea: number;
    kpi1: number;
    kpi2: number;
    kpi3: number;
    kpi4: number;
    appreciationDate: Date;
    useCalcROI: boolean;
    roiWeightedYield: number;
    roiInflation: number;
    roiCalculated: number;
    roiManual: number;
    usePrimeYield: boolean;
    manYieldWeighted: number;
    manYieldOffice: number;
    manYieldMerch: number;
    manYieldMisc: number;
    costs: {
      ownerCostsMethod: boolean;
      ownerCostsManual: number;
      costMaintenance: number;
      costInsurance: number;
      costRevision: number;
      costAdm: number;
      costOther: number;
      costNegotiation: number;
      costLegalFees: number;
      costConsultFees: number;
      costAssetMgmt: number;
    };
  };
}

export function AnalysisTableDCF({ details }: AnalysisTableDCFProps) {
  const startYear = 2024;
  const endYear = 2033;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString()
  );

  const kpiAdjustments = [
    0, // First year, no adjustment
    details.kpi1,
    details.kpi2,
    details.kpi3,
    ...Array(endYear - startYear - 3).fill(details.kpi4)
  ];

  // Calculate rental incomes for each year
  const rentalIncomes = [details.rentPerArea];
  for (let i = 1; i < years.length; i++) {
    const previousIncome = rentalIncomes[i - 1];
    const kpi = kpiAdjustments[i] || 0;
    rentalIncomes.push(previousIncome * (1 + kpi / 100));
  }

  // Round the rental incomes for display
  const roundedRentalIncomes = rentalIncomes.map(income => Math.round(income));

  // Calculate gross rental incomes
  const grossRentalIncomes = roundedRentalIncomes.map(
    income => income * details.rentableArea
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Parse the big expenses
  const bigExpenses = JSON.parse(details.costBigExpenses || "{}");

  // Calculate the sum of individual cost items
  const calculateAutomaticCosts = () => {
    const sum =
      (details.costs.costMaintenance || 0) +
      (details.costs.costInsurance || 0) +
      (details.costs.costRevision || 0) +
      (details.costs.costAdm || 0) +
      (details.costs.costOther || 0) +
      (details.costs.costNegotiation || 0) +
      (details.costs.costLegalFees || 0) +
      (details.costs.costConsultFees || 0) +
      (details.costs.costAssetMgmt || 0);

    return sum;
  };

  // Calculate the net rental incomes
  const netRentalIncomes = grossRentalIncomes.map((grossIncome, index) => {
    const year = years[index];
    const totalCosts = details.costs.ownerCostsMethod
      ? calculateAutomaticCosts()
      : details.costs.ownerCostsManual || 0;
    const tenantAdjustments = bigExpenses[year] || 0;
    return grossIncome - totalCosts - tenantAdjustments;
  });

  // Calculate "Andel inkludert i DCF" for each year
  const andelInkludertIDCF = years.map((year, index) => {
    const currentYear = new Date(`${year}-01-01`);
    const lastDayOfYear = new Date(`${year}-12-31`);
    const daysForDCF =
      index === 0
        ? differenceInDays(lastDayOfYear, new Date(details.appreciationDate))
        : 365;
    return daysForDCF / 365;
  });

  // Determine the discount rate based on useCalcROI
  const discountRate = details.useCalcROI
    ? details.roiWeightedYield + details.roiInflation + details.roiCalculated
    : details.roiManual;

  // Calculate diskonteringsperiode, diskonteringsfaktor, and nåverdi kontantstrøm
  const calculateDiscountValues = () => {
    const discountValues = andelInkludertIDCF.map((percentage, index) => {
      const discountPeriod = index === 0 ? percentage : index + percentage;
      const discountFactor = 1 / (1 + discountRate) ** discountPeriod;
      const discountedCashFlow = netRentalIncomes[index] * discountFactor;
      return {
        discountPeriod: discountPeriod,
        discountFactor: discountFactor,
        discountedCashFlow: discountedCashFlow
      };
    });
    return discountValues;
  };

  const discountValues = calculateDiscountValues();

  // Calculate Sum Nåverdi by summing all the discounted cash flows
  const sumNaverdi = discountValues.reduce(
    (sum, value) => sum + value.discountedCashFlow,
    0
  );

  // Calculate Exit Verdi using the last year's net rental income and yield
  const exitYearNetIncome = netRentalIncomes[netRentalIncomes.length - 1];
  const exitYield = details.usePrimeYield
    ? details.manYieldWeighted
    : (details.manYieldOffice + details.manYieldMerch + details.manYieldMisc) /
      3;
  const exitVerdi = exitYearNetIncome / exitYield;

  // Calculate Total Eiendomsverdi by summing Sum Nåverdi and Exit Verdi and multiplying by the last year's discount factor
  const totalEiendomsverdi =
    (sumNaverdi + exitVerdi) *
    discountValues[discountValues.length - 1].discountFactor;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Kontantstrøm</CardTitle>
          <CardDescription>Kontantstrøm for eiendommen</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NOK</TableHead>
                  {years.map(year => (
                    <TableHead key={year}>{year}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Utleibart areal</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dette representerer utleibart areal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {years.map(year => (
                    <TableCell key={year}>
                      {formatNumber(details.rentableArea)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Løpende leie</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dette representerer løpende leie</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {roundedRentalIncomes.map((income, index) => (
                    <TableCell key={years[index]}>
                      {formatNumber(income)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Brutto leieinntekter</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Utleibart areal x løpende leie</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {grossRentalIncomes.map((income, index) => (
                    <TableCell key={years[index]}>
                      {formatNumber(income)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="text-muted-foreground text-sm">
                  <TableCell colSpan={years.length + 1}>Kostnader</TableCell>
                </TableRow>
                {details.costs.ownerCostsMethod ? (
                  <TableRow>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Automatisk regnet kostnader</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Sum av alle individuelle kostnader: vedlikehold,
                            forsikring, revisjon, administrasjon, andre
                            driftskostnader, megling/utleie, juridiske
                            honorarer, honorar konsulenter, asset management.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    {years.map(year => (
                      <TableCell key={year}>
                        {formatNumber(calculateAutomaticCosts())}
                      </TableCell>
                    ))}
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>Manuelle eierkostnader</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Totale manuelle eierkostnader</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    {years.map(year => (
                      <TableCell key={year}>
                        {formatNumber(details.costs.ownerCostsManual || 0)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Leietakertilpassninger</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Kostnader for leietakertilpassninger</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {years.map(year => (
                    <TableCell key={year}>
                      {formatNumber(bigExpenses[year] || 0)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Netto leieinntekter</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Brutto leieinntekter minus kostnader og
                          leietakertilpassninger
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {netRentalIncomes.map((income, index) => (
                    <TableCell key={years[index]}>
                      {formatNumber(income)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="text-muted-foreground text-sm">
                  <TableCell colSpan={years.length + 1}>
                    Diskonteringsdetaljer
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Andel inkludert i DCF</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Andel inkludert i DCF for hver periode. Første året er
                          antall dager mellom verdsettelsesdato og slutten av
                          året delt på 365. For påfølgende år er det 365 dager
                          delt på 365.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {andelInkludertIDCF.map((percentage, index) => (
                    <TableCell key={years[index]}>
                      {(percentage * 100).toFixed(2)}%
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Diskonteringsperiode</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Periode for diskontering. For første året er det andel
                          inkludert i DCF. For påfølgende år er det året + andel
                          inkludert i DCF.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {discountValues.map((value, index) => (
                    <TableCell key={years[index]}>
                      {value.discountPeriod.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Diskonteringsfaktor</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Faktor for diskontering, beregnet som 1 / (1 +
                          diskonteringsrate) ^ diskonteringsperiode.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {discountValues.map((value, index) => (
                    <TableCell key={years[index]}>
                      {value.discountFactor.toFixed(4)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>Nåverdi kontantstrøm</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Nåverdi av kontantstrøm, beregnet som netto
                          leieinntekter multiplisert med diskonteringsfaktor.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {discountValues.map((value, index) => (
                    <TableCell key={years[index]}>
                      {formatNumber(value.discountedCashFlow)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sum Nåverdi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatNumber(sumNaverdi)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exit Verdi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatNumber(exitVerdi)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Eiendomsverdi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{formatNumber(totalEiendomsverdi)}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
