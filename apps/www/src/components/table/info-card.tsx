import { format } from "date-fns";
import { File, MoveVerticalIcon, Pencil, Trash } from "lucide-react";

import { Badge } from "@dingify/ui/components/badge";
import { Button } from "@dingify/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dingify/ui/components/dropdown-menu";
import { Separator } from "@dingify/ui/components/separator";

export default function InfoCard({
  data,
  type,
}: {
  data?: {
    id: number;
    name: string;
    createdAt: Date;
    buildings?: {
      name: string;
      address: string;
      floors: { maxTotalKvm: number }[];
    }[];
    floor?: number | string | null;
    officeSpace?: number | string | null;
  };
  type: "property" | "tenant";
}) {
  const handleDelete = () => {
    // Handle delete action
  };

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
            );
          }, 0)
          .toString()
      : "Legg til areal";

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
              {/* <CopyIcon className="h-3 w-3" /> */}
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
                {data?.buildings?.[0]?.name
                  ? data.buildings[0].name
                  : "Placeholder Building"}
                {data?.floor && " - " + data.floor}
              </>
            )}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8" size="icon" variant="outline">
                <MoveVerticalIcon className="h-3.5 w-3.5" />
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
              <span>{data?.name || "Placeholder Name"}</span>
            </li>
            {type === "tenant" && (
              <>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Adresse</span>
                  <span>{data?.name || "Placeholder Adresse"}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Building</span>
                  <span>
                    {data?.buildings?.[0]?.name
                      ? data.buildings[0].name
                      : "Placeholder Building"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Floor</span>
                  <span>{data?.floor || "Placeholder Floor"}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Office Space</span>
                  <span>{data?.officeSpace || "Placeholder Office Space"}</span>
                </li>
              </>
            )}
            {type === "property" && (
              <>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Adresse</span>
                  <span>
                    {data?.buildings?.[0]?.address
                      ? data.buildings[0].address
                      : "Placeholder Adresse"}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type bygg</span>
                  <span>
                    {data?.buildings?.[0]?.name
                      ? data.buildings[0].name
                      : "Placeholder Building"}
                  </span>
                </li>
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
                <span className="text-muted-foreground">Ledig areal</span>
                <span>1800 kvm</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Ledig kontorer</span>
                <span>9 enheter</span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-muted-foreground">Ledighet i %</span>
                <span>
                  <Badge className="text-xs" variant="outline">
                    14%
                  </Badge>
                </span>
              </li>
            </ul>
          )}
          {type === "tenant" && (
            <ul className="grid gap-3">
              <div className="font-semibold">Placeholder</div>

              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Placeholder</span>
                <span>Placeholder</span>
              </li>
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Ledig areal</span>
                <span>1800 kvm</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Ledig kontorer</span>
                <span>9 enheter</span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-muted-foreground">Ledighet i %</span>
                <span>
                  <Badge className="text-xs" variant="outline">
                    14%
                  </Badge>
                </span>
              </li> */}
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
                    14.000 kr
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Pris pr kvm</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    3.100 kr
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Leieforholdet utgår</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    6 måneder
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
                    52 MNOK
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Leie pr kvm</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    2870 kr
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Ledighet</dt>
                <dd>
                  <Badge className="text-xs" variant="secondary">
                    12%
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
  );
}
