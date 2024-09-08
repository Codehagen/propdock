import { Badge } from "@propdock/ui/components/badge";
import { Button } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@propdock/ui/components/dropdown-menu";
import { Separator } from "@propdock/ui/components/separator";
import { format } from "date-fns";
import { File, MoveVerticalIcon, Pencil, Trash } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

export function AnalysisInfoCard({ analysisDetails }) {
  const handleDelete = () => {
    // Handle delete action
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {analysisDetails.name}
            <Button
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Copy Analysis ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Verdivurdering per{" "}
            {format(new Date(analysisDetails.appreciationDate), "dd.MM.yyyy")}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>{/* ... (same as before) ... */}</DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Eiendomsdetaljer</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Areal</span>
              <Badge variant="secondary">
                {analysisDetails.rentableArea} kvm
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Kontor</span>
              <Badge variant="secondary">
                {Math.round(analysisDetails.ratioAreaOffice * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Handel</span>
              <Badge variant="secondary">
                {Math.round(analysisDetails.ratioAreaMerch * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Annet</span>
              <Badge variant="secondary">
                {Math.round(analysisDetails.ratioAreaMisc * 100)}%
              </Badge>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="font-semibold">Økonomi</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Yield</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {analysisDetails.useCalcROI
                    ? Math.round(analysisDetails.roiCalculated * 100)
                    : Math.round(analysisDetails.roiManual * 100)}
                  %
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Årlig leieinntekt</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {formatCurrency(
                    analysisDetails.rentableArea * analysisDetails.rentPerArea
                  )}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Eierkostnader</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {formatCurrency(analysisDetails.costs.costSum)}
                </Badge>
              </dd>
            </div>
          </dl>
          <Separator className="my-2" />
          <div className="font-semibold">Markedsdata</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Markedsleie kontor</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {formatCurrency(analysisDetails.marketRentOffice)}/kvm
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Markedsleie handel</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {formatCurrency(analysisDetails.marketRentMerch)}/kvm
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Markedsleie annet</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {formatCurrency(analysisDetails.marketRentMisc)}/kvm
                </Badge>
              </dd>
            </div>
          </dl>
          <Separator className="my-2" />
          <div className="font-semibold">KPI-verdier</div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">KPI 1</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {Math.round(analysisDetails.kpi1 * 100)}%
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">KPI 2</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {Math.round(analysisDetails.kpi2 * 100)}%
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">KPI 3</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {Math.round(analysisDetails.kpi3 * 100)}%
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">KPI 4</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {Math.round(analysisDetails.kpi4 * 100)}%
                </Badge>
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
        <div className="text-muted-foreground text-xs">
          Oppdatert {format(new Date(analysisDetails.updatedAt), "dd.MM.yyyy")}
        </div>
        <div className="font-medium text-xs">
          Totalverdi: {formatCurrency(analysisDetails.sumValueNow)}
        </div>
      </CardFooter>
    </Card>
  );
}
