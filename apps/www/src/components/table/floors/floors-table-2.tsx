"use client"

import React, { useEffect, useReducer, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { assignTenantToOffice } from "@/actions/assign-tenant-to-office"
import { createFloor } from "@/actions/create-floor"
import {
  quickAddOfficeSpace,
  quickDeleteOfficeSpace,
} from "@/actions/create-quick-office-space"
import { updateFloor } from "@/actions/update-floor-table"
import { updateOfficeSpace } from "@/actions/update-office-space"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@propdock/ui/components/alert"
import { Badge } from "@propdock/ui/components/badge"
import { Button } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import { Input } from "@propdock/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propdock/ui/components/select"
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
  TooltipTrigger,
} from "@propdock/ui/components/tooltip"
import {
  AlertTriangle,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  MinusCircle,
  PlusCircle,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

interface OfficeSpace {
  id: string
  name: string
  sizeKvm: number
  exclusiveAreaKvm: number
  commonAreaKvm: number
  isRented: boolean
  tenants: { name: string }[]
}

interface Floor {
  id: string
  number: number
  maxTotalKvm: number
  officeSpaces: OfficeSpace[]
}

interface State {
  floors: Floor[]
  tenants: { id: string; name: string }[]
  sortConfig: {
    key: keyof OfficeSpace | null
    direction: "ascending" | "descending"
  }
}

type Action =
  | { type: "SET_FLOORS"; floors: Floor[] }
  | { type: "UPDATE_FLOOR"; floorId: string; field: keyof Floor; value: any }
  | {
      type: "UPDATE_OFFICE"
      floorId: string
      officeId: string
      field: keyof OfficeSpace
      value: any
    }
  | { type: "ADD_OFFICE"; floorId: string; office: OfficeSpace }
  | { type: "SORT"; key: keyof OfficeSpace }
  | { type: "DELETE_OFFICE"; officeId: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FLOORS":
      return { ...state, floors: action.floors }
    case "UPDATE_FLOOR":
      return {
        ...state,
        floors: state.floors.map((floor) =>
          floor.id === action.floorId
            ? { ...floor, [action.field]: action.value }
            : floor,
        ),
      }
    case "UPDATE_OFFICE":
      return {
        ...state,
        floors: state.floors.map((floor) =>
          floor.id === action.floorId
            ? {
                ...floor,
                officeSpaces: floor.officeSpaces.map((office) =>
                  office.id === action.officeId
                    ? {
                        ...office,
                        [action.field]: action.value,
                        // Update isRented based on tenants
                        ...(action.field === "tenants" && {
                          isRented:
                            Array.isArray(action.value) &&
                            action.value.length > 0,
                        }),
                      }
                    : office,
                ),
              }
            : floor,
        ),
      }
    case "ADD_OFFICE":
      return {
        ...state,
        floors: state.floors.map((floor) =>
          floor.id === action.floorId
            ? {
                ...floor,
                officeSpaces: [...floor.officeSpaces, action.office],
              }
            : floor,
        ),
      }
    case "SORT":
      return {
        ...state,
        sortConfig: {
          key: action.key,
          direction:
            state.sortConfig.key === action.key &&
            state.sortConfig.direction === "ascending"
              ? "descending"
              : "ascending",
        },
      }
    case "DELETE_OFFICE":
      return {
        ...state,
        floors: state.floors.map((floor) => ({
          ...floor,
          officeSpaces: floor.officeSpaces.filter(
            (office) => office.id !== action.officeId,
          ),
        })),
      }
    default:
      return state
  }
}

const initialState: State = {
  floors: [],
  tenants: [],
  sortConfig: { key: null, direction: "ascending" },
}

interface FloorsTable2Props {
  floors: Floor[]
  tenants: { id: string; name: string }[]
}

export default function FloorsTable2({ floors, tenants }: FloorsTable2Props) {
  const [state, dispatch] = useReducer(reducer, {
    floors: [],
    tenants: tenants,
    sortConfig: { key: null, direction: "ascending" },
  })
  const [editingCell, setEditingCell] = useState<{
    floorId: string
    officeId: string
    field: string
  } | null>(null)
  const params = useParams()
  const pathname = usePathname()
  const buildingId = Array.isArray(params.buildingId)
    ? params.buildingId[0]
    : params.buildingId

  useEffect(() => {
    dispatch({ type: "SET_FLOORS", floors })
  }, [floors])

  const handleCellEdit = async (
    floorId: string,
    officeId: string,
    field: string,
    value: string | number,
  ) => {
    try {
      let parsedValue: string | number = value
      if (
        field === "sizeKvm" ||
        field === "commonAreaKvm" ||
        field === "exclusiveAreaKvm"
      ) {
        parsedValue = Number(value)
        if (isNaN(parsedValue)) {
          throw new Error(`Ugyldig tall for ${field}`)
        }
      }

      // Update local state immediately
      dispatch({
        type: "UPDATE_OFFICE",
        floorId,
        officeId,
        field: field as keyof OfficeSpace,
        value: parsedValue,
      })

      // Call the server action
      const result = await updateOfficeSpace(officeId, { [field]: parsedValue })

      if (result.success) {
        toast.success("Kontorlokale oppdatert.")
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere kontorlokale.")
      }
    } catch (error) {
      // Revert the local state update if there's an error
      dispatch({
        type: "UPDATE_OFFICE",
        floorId,
        officeId,
        field: field as keyof OfficeSpace,
        value: office[field as keyof OfficeSpace],
      })
      toast.error(error.message)
      console.error("Feil ved oppdatering av kontorlokale:", error)
    } finally {
      setEditingCell(null)
    }
  }

  const handleCellChange = async (
    floorId: string,
    officeId: string,
    field: string,
    value: string | boolean,
  ) => {
    try {
      let result

      if (field === "tenants") {
        // Use the new assignTenantToOffice action
        const tenantId =
          value === "none"
            ? null
            : state.tenants.find((t) => t.name === value)?.id
        if (value !== "none" && !tenantId) {
          throw new Error("Selected tenant not found")
        }
        result = await assignTenantToOffice(officeId, tenantId, pathname)
      } else {
        // For other fields, use the existing updateOfficeSpace action
        result = await updateOfficeSpace(officeId, { [field]: value }, pathname)
      }

      if (result.success) {
        // Update local state
        dispatch({
          type: "UPDATE_OFFICE",
          floorId,
          officeId,
          field: field as keyof OfficeSpace,
          value: result.office[field as keyof OfficeSpace],
        })
        toast.success("Kontorlokale oppdatert.")
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere kontorlokale.")
      }
    } catch (error) {
      // Revert the local state update if there's an error
      const currentOffice = state.floors
        .find((f) => f.id === floorId)
        ?.officeSpaces.find((o) => o.id === officeId)

      if (currentOffice) {
        dispatch({
          type: "UPDATE_OFFICE",
          floorId,
          officeId,
          field: field as keyof OfficeSpace,
          value: currentOffice[field as keyof OfficeSpace],
        })
      }
      toast.error(error.message)
      console.error("Feil ved oppdatering av kontorlokale:", error)
    }
  }

  const handleFloorEdit = async (
    floorId: string,
    field: string,
    value: number,
  ) => {
    try {
      // Update local state immediately
      dispatch({
        type: "UPDATE_FLOOR",
        floorId,
        field: field as keyof Floor,
        value,
      })

      // Call the server action
      const result = await updateFloor(floorId, { [field]: value })

      if (result.success) {
        toast.success("Etasje oppdatert.")
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere etasje.")
      }
    } catch (error) {
      // Revert the local state update if there's an error
      dispatch({
        type: "UPDATE_FLOOR",
        floorId,
        field: field as keyof Floor,
        value: floor[field as keyof Floor],
      })
      toast.error(error.message)
      console.error("Feil ved oppdatering av etasje:", error)
    } finally {
      setEditingCell(null)
    }
  }

  const EditableCell = ({ floor, office, field, type = "text" }) => {
    const isEditing =
      editingCell?.floorId === floor.id &&
      editingCell?.officeId === office.id &&
      editingCell?.field === field
    const value = office[field]

    return (
      <TableCell
        onClick={() =>
          setEditingCell({ floorId: floor.id, officeId: office.id, field })
        }
        className="relative cursor-pointer p-4"
      >
        {isEditing ? (
          <Input
            type={type}
            defaultValue={value}
            autoFocus
            onBlur={(e) =>
              handleCellEdit(floor.id, office.id, field, e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCellEdit(
                  floor.id,
                  office.id,
                  field,
                  e.currentTarget.value,
                )
              }
            }}
            className="absolute inset-0 h-full w-full border-none bg-white p-4 focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <div className={type === "number" ? "text-right" : ""}>
            {type === "number" && value != null
              ? Number(value).toLocaleString()
              : value || ""}
          </div>
        )}
      </TableCell>
    )
  }

  const EditableFloorCell = ({ floor, field, type = "text" }) => {
    const isEditing =
      editingCell?.floorId === floor.id &&
      editingCell?.officeId === null &&
      editingCell?.field === field
    const value = floor[field]

    return (
      <div
        onClick={() =>
          setEditingCell({ floorId: floor.id, officeId: null, field })
        }
        className="relative cursor-pointer p-2"
      >
        {isEditing ? (
          <Input
            type={type}
            defaultValue={value}
            autoFocus
            onBlur={(e) =>
              handleFloorEdit(floor.id, field, Number(e.target.value))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFloorEdit(floor.id, field, Number(e.currentTarget.value))
              }
            }}
            className="absolute inset-0 h-full w-full border-2 border-blue-500 bg-white p-2 text-lg font-semibold focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="text-right text-lg font-semibold">
            {type === "number" && value != null
              ? Number(value).toLocaleString()
              : value || ""}
          </div>
        )}
      </div>
    )
  }

  const sortedOffices = (offices: OfficeSpace[]) => {
    if (!state.sortConfig.key) return offices

    return [...offices].sort((a, b) => {
      if (a[state.sortConfig.key!] < b[state.sortConfig.key!]) {
        return state.sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[state.sortConfig.key!] > b[state.sortConfig.key!]) {
        return state.sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  const renderSortIcon = (key: keyof OfficeSpace) => {
    if (state.sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return state.sortConfig.direction === "ascending" ? (
      <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 rotate-180 transform text-blue-500" />
    )
  }

  const calculateTotalOfficeArea = (offices: OfficeSpace[]) => {
    return offices.reduce(
      (total, office) =>
        total + Number(office.sizeKvm) + Number(office.commonAreaKvm),
      0,
    )
  }

  const handleAddFloor = async () => {
    if (!buildingId) {
      toast.error("Bygnings-ID mangler")
      return
    }

    const newFloorNumber = state.floors.length + 1
    try {
      const result = await createFloor(buildingId, {
        number: newFloorNumber,
        maxTotalKvm: 0,
        maxOfficeKvm: 0,
        maxCommonKvm: 0,
      })

      if (result.success && result.floor) {
        dispatch({
          type: "ADD_FLOOR",
          floor: {
            id: result.floor.id,
            number: newFloorNumber,
            maxTotalKvm: result.floor.maxTotalKvm,
            officeSpaces: [],
          },
        })
        toast.success(`Etasje ${newFloorNumber} er lagt til`)
      } else {
        throw new Error(result.error || "Kunne ikke legge til etasje")
      }
    } catch (error) {
      toast.error("Feil ved tillegging av etasje: " + error.message)
    }
  }

  const handleQuickAddOffice = async (floorId: string) => {
    try {
      const result = await quickAddOfficeSpace(
        floorId,
        {
          name: `Kontor ${state.floors.find((f) => f.id === floorId)?.officeSpaces.length + 1 || 1}`,
          sizeKvm: 0,
          exclusiveAreaKvm: 0,
          commonAreaKvm: 0,
          isRented: false,
        },
        pathname,
      )

      if (result.success && result.office) {
        const officeWithTenants = {
          ...result.office,
          tenants: [], // Initialize tenants as an empty array
        }
        dispatch({
          type: "ADD_OFFICE",
          floorId,
          office: officeWithTenants,
        })
        toast.success(`Kontor ${result.office.name} er lagt til`)
      } else {
        throw new Error(result.error || "Kunne ikke legge til kontor")
      }
    } catch (error) {
      toast.error("Feil ved tillegging av kontor: " + error.message)
    }
  }

  const handleQuickDelete = async (officeId: string) => {
    try {
      const result = await quickDeleteOfficeSpace(officeId, pathname)

      if (!result.success) {
        throw new Error(result.error || "Failed to quick delete office space.")
      }

      toast.success("Kontoret er slettet")

      // Update local state
      dispatch({
        type: "DELETE_OFFICE",
        officeId,
      })
    } catch (error) {
      toast.error("Error deleting office space.")
      console.error("Error deleting office space:", error)
    }
  }

  return (
    <div className="container mx-auto space-y-8 p-4">
      {state.floors.map((floor) => {
        const totalOfficeArea = calculateTotalOfficeArea(floor.officeSpaces)
        const areaDiscrepancy = floor.maxTotalKvm - totalOfficeArea

        return (
          <Card key={floor.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                Etasje {floor.number}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Totalt etasjeareal:</span>
                <div className="w-24">
                  <EditableFloorCell
                    floor={floor}
                    field="maxTotalKvm"
                    type="number"
                  />
                </div>
                <span>kvm</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAddOffice(floor.id)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Legg til kontor
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => dispatch({ type: "SORT", key: "name" })}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4" />
                        Kontor
                        {renderSortIcon("name")}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => dispatch({ type: "SORT", key: "sizeKvm" })}
                      className="cursor-pointer"
                    >
                      Eksklusivt areal (kvm) {renderSortIcon("sizeKvm")}
                    </TableHead>
                    <TableHead
                      onClick={() =>
                        dispatch({ type: "SORT", key: "commonAreaKvm" })
                      }
                      className="cursor-pointer"
                    >
                      Fellesareal (kvm) {renderSortIcon("commonAreaKvm")}
                    </TableHead>
                    <TableHead>Totalt areal (kvm)</TableHead>
                    <TableHead
                      onClick={() =>
                        dispatch({ type: "SORT", key: "isRented" })
                      }
                      className="cursor-pointer"
                    >
                      Leietaker {renderSortIcon("isRented")}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Slett</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOffices(floor.officeSpaces).map((office) => (
                    <TableRow
                      key={office.id}
                      className={office.isRented ? "bg-green-50" : "bg-red-50"}
                    >
                      <EditableCell
                        floor={floor}
                        office={office}
                        field="name"
                      />
                      <EditableCell
                        floor={floor}
                        office={office}
                        field="sizeKvm"
                        type="number"
                      />
                      <EditableCell
                        floor={floor}
                        office={office}
                        field="commonAreaKvm"
                        type="number"
                      />
                      <TableCell className="text-right">
                        {(
                          Number(office.sizeKvm) + Number(office.commonAreaKvm)
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={
                            office.tenants && office.tenants.length > 0
                              ? office.tenants[0].name
                              : "none"
                          }
                          onValueChange={(value) =>
                            handleCellChange(
                              floor.id,
                              office.id,
                              "tenants",
                              value,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Velg leietaker" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              Ingen leietaker
                            </SelectItem>
                            {state.tenants.map((tenant) => (
                              <SelectItem key={tenant.id} value={tenant.name}>
                                {tenant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {office.isRented ? (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 bg-green-100 text-green-800"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Utleid
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Ledig
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleQuickDelete(office.id)}
                              variant="ghost"
                              size="icon"
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Slett kontor</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              {areaDiscrepancy !== 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Arealavvik</AlertTitle>
                  <AlertDescription>
                    Det totale arealet av kontorer ({totalOfficeArea} kvm)
                    samsvarer ikke med det totale etasjearealet (
                    {floor.maxTotalKvm} kvm).
                    {areaDiscrepancy > 0
                      ? ` Det er ${areaDiscrepancy} kvm uallokert areal.`
                      : ` Kontorene overstiger etasjearealet med ${Math.abs(areaDiscrepancy)} kvm.`}
                  </AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </Card>
        )
      })}
      <div className="flex justify-center">
        <Button onClick={handleAddFloor} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Legg til etasje
        </Button>
      </div>
    </div>
  )
}
