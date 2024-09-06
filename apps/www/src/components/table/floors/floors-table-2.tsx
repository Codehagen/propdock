"use client"

import React, { useEffect, useReducer, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { createFloor } from "@/actions/create-floor"
import { quickAddOfficeSpace } from "@/actions/create-quick-office-space"
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
  AlertTriangle,
  ArrowUpDown,
  Building2,
  CheckCircle2,
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
  tenants: string[]
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
                    ? { ...office, [action.field]: action.value }
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
    default:
      return state
  }
}

const initialState: State = {
  floors: [],
  tenants: ["Tenant A", "Tenant B", "Tenant C"], // You might want to fetch this from the database
  sortConfig: { key: null, direction: "ascending" },
}

interface FloorsTable2Props {
  floors: Floor[]
}

export default function FloorsTable2({ floors }: FloorsTable2Props) {
  const [state, dispatch] = useReducer(reducer, initialState)
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
    setEditingCell(null)
    try {
      let parsedValue: string | number = value
      if (field === "sizeKvm" || field === "commonAreaKvm") {
        parsedValue = Number(value)
        if (isNaN(parsedValue)) {
          throw new Error(`Invalid number for ${field}`)
        }
      }

      const result = await updateOfficeSpace(
        officeId,
        { [field]: parsedValue },
        pathname,
      )
      if (result.success) {
        dispatch({
          type: "UPDATE_OFFICE",
          floorId,
          officeId,
          field: field as keyof OfficeSpace,
          value: parsedValue,
        })
        toast.success("Office space updated successfully.")
      } else {
        throw new Error(result.error || "Failed to update office space.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Error updating office space:", error)
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
      toast.error("Building ID is missing")
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
        toast.success(`Floor ${newFloorNumber} has been added`)
      } else {
        throw new Error(result.error || "Failed to add floor")
      }
    } catch (error) {
      toast.error("Error adding floor: " + error.message)
    }
  }

  const handleQuickAddOffice = async (floorId: string) => {
    try {
      const result = await quickAddOfficeSpace(
        floorId,
        {
          name: `Office ${state.floors.find((f) => f.id === floorId)?.officeSpaces.length + 1 || 1}`,
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
        toast.success(`Office ${result.office.name} has been added`)
      } else {
        throw new Error(result.error || "Failed to add office")
      }
    } catch (error) {
      toast.error("Error adding office: " + error.message)
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
                Floor {floor.number}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Total floor area:</span>
                <EditableCell
                  floor={floor}
                  office={floor}
                  field="maxTotalKvm"
                  type="number"
                />
                <span>sqm</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAddOffice(floor.id)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add office
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
                        Office
                        {renderSortIcon("name")}
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => dispatch({ type: "SORT", key: "sizeKvm" })}
                      className="cursor-pointer"
                    >
                      Exclusive area (sqm) {renderSortIcon("sizeKvm")}
                    </TableHead>
                    <TableHead
                      onClick={() =>
                        dispatch({ type: "SORT", key: "commonAreaKvm" })
                      }
                      className="cursor-pointer"
                    >
                      Common area (sqm) {renderSortIcon("commonAreaKvm")}
                    </TableHead>
                    <TableHead>Total area (sqm)</TableHead>
                    <TableHead
                      onClick={() =>
                        dispatch({ type: "SORT", key: "isRented" })
                      }
                      className="cursor-pointer"
                    >
                      Tenant {renderSortIcon("isRented")}
                    </TableHead>
                    <TableHead>Status</TableHead>
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
                            <SelectValue placeholder="Select tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No tenant</SelectItem>
                            {state.tenants.map((tenant) => (
                              <SelectItem key={tenant} value={tenant}>
                                {tenant}
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
                            Rented
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Available
                          </Badge>
                        )}
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
                  <AlertTitle>Area Discrepancy</AlertTitle>
                  <AlertDescription>
                    The total area of offices ({totalOfficeArea} sqm) does not
                    match the total floor area ({floor.maxTotalKvm} sqm).
                    {areaDiscrepancy > 0
                      ? ` There is ${areaDiscrepancy} sqm unallocated area.`
                      : ` The offices exceed the floor area by ${Math.abs(areaDiscrepancy)} sqm.`}
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
          Add floor
        </Button>
      </div>
    </div>
  )
}
