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
import { File, MoreHorizontal, Pencil, Trash } from "lucide-react"

function formatNOK(amount: number): string {
  const formatter = new Intl.NumberFormat("no-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `kr ${formatter.format(amount)}`
}

export default function InfoCard({
  data,
  type,
}: {
  data?: {
    id: string
    name: string
    createdAt: Date
    orgnr?: number
    building?: { name: string }
    floor?: { number: number } | null
    officeSpace?: { name: string } | null
    contracts?: {
      id: string
      startDate: Date
      endDate: Date
      baseRent?: number
    }[]
    currentRent?: number | null
    contractStartDate?: Date | null
    contractEndDate?: Date | null
    contactPerson?: {
      name: string
      email: string
      phone?: string
    } | null
  }
  type: "property" | "tenant"
}) {
  const handleDelete = () => {
    // Handle delete action
  }

  // Calculate maxTotalKvm
  const maxTotalKvm =
    type === "property" && data?.buildings
      ? data.buildings
          .reduce((acc, building) => {
            return (
              acc +
              building.floors.reduce(
                (floorAcc, floor) => floorAcc + floor.maxTotalKvm,
                0,
              )
            )
          }, 0)
          .toString()
      : "Legg til areal"

  // Calculate number of tenants
  const numberOfTenants = data?.tenants?.length || 0

  // Calculate number of contracts
  const numberOfContracts = data?.contracts?.length || 0

  // Calculate total rent
  const totalRent =
    data?.contracts?.reduce(
      (acc, contract) => acc + (contract.baseRent || 0),
      0,
    ) || 0

  // Calculate vacancy rate
  const vacancyRate =
    data?.buildings?.reduce((acc, building) => {
      const totalArea = building.floors.reduce(
        (sum, floor) => sum + floor.maxTotalKvm,
        0,
      )
      const occupiedArea =
        data.contracts?.reduce(
          (sum, contract) =>
            sum + (contract.baseRent ? contract.baseRent / 12 : 0),
          0,
        ) || 0
      return acc + (totalArea - occupiedArea) / totalArea
    }, 0) || 0

  // Calculate average rent per sqm
  const averageRentPerSqm =
    totalRent /
    (data?.buildings?.reduce(
      (acc, building) =>
        acc +
        building.floors.reduce((sum, floor) => sum + floor.maxTotalKvm, 0),
      0,
    ) || 1)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {data?.name || "Placeholder Name"}
            <Button
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Copy Event ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            {type === "property" ? (
              data?.createdAt ? (
                format(data.createdAt, "MM/dd/yyyy")
              ) : (
                "Placeholder Date"
              )
            ) : (
              <>
                {data?.building?.name
                  ? data.building.name
                  : "Placeholder Building"}
                {data?.floor && " - " + data.floor.number}
              </>
            )}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8" size="icon" variant="outline">
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <File className="mr-2 h-4 w-4" />
                <span>Export</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleDelete} disabled={!data}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Detaljer</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Navn</span>
              <span>{data?.name || "Ikke tilgjengelig"}</span>
            </li>
            {type === "tenant" && (
              <>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bygning</span>
                  <span>{data?.building?.name || "Ikke tilgjengelig"}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Org.nr</span>
                  <span>{data?.orgnr || "Ikke tilgjengelig"}</span>
                </li>
              </>
            )}
            {type === "property" && (
              <>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Adresse</span>
                  <span>
                    {data?.buildings?.[0]?.address || "Legg til adresse"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bygg</span>
                  <span>
                    {data?.buildings?.[0]?.name || "Legg til byggtype"}
                  </span>
                </li>
                {/* <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Org.nr</span>
                  <span>{data?.orgnr || "Ikke tilgjengelig"}</span>
                </li> */}
              </>
            )}
          </ul>
          <Separator className="my-2" />
          {type === "property" && (
            <ul className="grid gap-3">
              <div className="font-semibold">Byggninger</div>

              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Størrelse</span>
                <span>{maxTotalKvm} kvm</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Antall leietakere</span>
                <span>{numberOfTenants}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Antall kontrakter</span>
                <span>{numberOfContracts}</span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-muted-foreground">Ledighet i %</span>
                <span>
                  <Badge className="text-xs" variant="outline">
                    {(vacancyRate * 100).toFixed(1)}%
                  </Badge>
                </span>
              </li>
            </ul>
          )}
          {type === "tenant" && (
            <ul className="grid gap-3">
              <div className="font-semibold">Kontaktperson</div>

              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Kontaktperson</span>
                <span>{data?.contactPerson?.name || "Ikke tilgjengelig"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">E-post</span>
                <span>{data?.contactPerson?.email || "Ikke tilgjengelig"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Telefon</span>
                <span>{data?.contactPerson?.phone || "Ikke tilgjengelig"}</span>
              </li>
            </ul>
          )}
        </div>
        <Separator className="my-4" />
        {type === "tenant" && (
          <div className="grid gap-3">
            <div className="font-semibold">Økonomi</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Måndelig leieinntekt</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    {formatNOK(data?.currentRent || 0)}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Leieforholdet starter</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    {data?.contractStartDate
                      ? format(data.contractStartDate, "dd.MM.yyyy")
                      : "N/A"}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Leieforholdet utgår</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    {data?.contractEndDate
                      ? format(data.contractEndDate, "dd.MM.yyyy")
                      : "N/A"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        )}
        {type === "property" && (
          <div className="grid gap-3">
            <div className="font-semibold">Økonomi</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Verdsettelse</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    {formatNOK(data?.analysis?.[0]?.sumValueNow || 0)}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Leie pr kvm</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    {formatNOK(Number(averageRentPerSqm) || 0)}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Ledighet</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    {(vacancyRate * 100).toFixed(1)}%
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          {/* Oppdatert */}
          {/* <time dateTime={new Date(data?.createdAt).toISOString()}>
            {" "}
            {new Date(data?.createdAt).toLocaleDateString()}
          </time> */}
        </div>
      </CardFooter>
    </Card>
  )
}
