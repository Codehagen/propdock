import { Badge } from "@propdock/ui/components/badge"
import { Button } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@propdock/ui/components/dropdown-menu"
import { Separator } from "@propdock/ui/components/separator"
import { format } from "date-fns"
import { File, MoveVerticalIcon, Pencil, Trash } from "lucide-react"

export function AnalysisInfoCard({ analysisDetails }) {
  const handleDelete = () => {
    // Handle delete action
  }

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
            {format(new Date(analysisDetails.appreciationDate), "dd.MM.yyyy")}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>{/* ... (same as in InfoCard) ... */}</DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Detaljer</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Utleibart areal</span>
              <span>{analysisDetails.rentableArea} kvm</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Kontor</span>
              <span>{analysisDetails.ratioAreaOffice}%</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Handel</span>
              <span>{analysisDetails.ratioAreaMerch}%</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Annet</span>
              <span>{analysisDetails.ratioAreaMisc}%</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <div className="font-semibold">Økonomi</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Yield</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {analysisDetails.roiWeightedYield}%
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Markedsleie kontor</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {analysisDetails.marketRentOffice} NOK/kvm
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Markedsleie handel</dt>
              <dd>
                <Badge className="text-xs" variant="secondary">
                  {analysisDetails.marketRentMerch} NOK/kvm
                </Badge>
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Oppdatert {format(new Date(analysisDetails.updatedAt), "dd.MM.yyyy")}
        </div>
      </CardFooter>
    </Card>
  )
}
