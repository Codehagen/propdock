"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  quickAddOfficeSpace,
  quickDeleteOfficeSpace,
} from "@/actions/create-quick-office-space"
import { quickDeleteFloor } from "@/actions/update-floor-details"
import {
  ChevronDown,
  MinusCircle,
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@dingify/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@dingify/ui/components/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@dingify/ui/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dingify/ui/components/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@dingify/ui/components/tooltip"

import { AddOfficeSpaceSheet } from "@/components/buttons/AddOfficeSpaceSheet"
import { EditFloorDetailsSheet } from "@/components/buttons/EditFloorDetailsSheet"
import { EditOfficeSpaceSheet } from "@/components/buttons/EditOfficeSpaceSheet"
import { SeeTenantsComboBox } from "@/components/buttons/SeeTenantsComboBox"

export default function FloorsTable({ floors }) {
  const handleKontraktClick = () => {
    console.log("Kontrakt clicked")
  }
  const params = useParams()
  const propertyId = Array.isArray(params.propertyId)
    ? params.propertyId[0]
    : params.propertyId
  const buildingId = Array.isArray(params.buildingId)
    ? params.buildingId[0]
    : params.buildingId
  const currentPath = `/property/${propertyId}/building/${buildingId}`

  const handleQuickAdd = async (floorId) => {
    try {
      const result = await quickAddOfficeSpace(
        floorId,
        {
          name: "Nytt Kontor",
          sizeKvm: 0,
          isRented: false,
        },
        currentPath,
      )

      if (!result.success) {
        throw new Error(result.error || "Failed to quick add office space.")
      }

      toast.success(`Nytt kontor "${result.office?.name}" er lagt til`)
    } catch (error) {
      toast.error("Error adding office space.")
      console.error("Error adding office space:", error)
    }
  }

  const handleQuickDelete = async (officeId) => {
    try {
      const result = await quickDeleteOfficeSpace(officeId, currentPath)

      if (!result.success) {
        throw new Error(result.error || "Failed to quick delete office space.")
      }

      toast.success("Kontoret er slettet")
    } catch (error) {
      toast.error("Error deleting office space.")
      console.error("Error deleting office space:", error)
    }
  }

  const handleDeleteFloor = async (floorId) => {
    try {
      const result = await quickDeleteFloor(floorId, currentPath)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete floor.")
      }

      toast.success("Etasjen er slettet")
    } catch (error) {
      toast.error("Error deleting floor.")
      console.error("Error deleting floor:", error)
    }
  }

  const calculateUnrentedCount = (officeSpaces) => {
    return officeSpaces.filter((office) => !office.isRented).length
  }

  const calculateTotalOffices = (officeSpaces) => {
    return officeSpaces.length
  }

  const calculateOccupancyRate = (officeSpaces) => {
    const totalOffices = officeSpaces.length
    const rentedOffices = officeSpaces.filter(
      (office) => office.isRented,
    ).length
    return totalOffices === 0
      ? "N/A"
      : `${((rentedOffices / totalOffices) * 100).toFixed(2)}%`
  }

  return (
    <div className="w-full sm:p-4">
      <div className="rounded-md sm:border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Etasje</TableHead>
              <TableHead className="font-medium">Total kvm</TableHead>
              <TableHead className="font-medium">Antall kontorer</TableHead>
              <TableHead className="font-medium">Ledige kontorer</TableHead>
              <TableHead className="font-medium">Utleid</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {floors
              ? floors.map((floor) => (
                  <Collapsible key={floor.id} asChild>
                    <>
                      <TableRow>
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <div className="flex cursor-pointer items-center space-x-1">
                              <span>{floor.number} etasje</span>
                              <ChevronDown className="chevron h-4 w-4 text-muted-foreground transition-transform duration-200" />
                            </div>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell>{floor.maxTotalKvm} kvm</TableCell>
                        <TableCell>
                          {calculateTotalOffices(floor.officeSpaces)}
                        </TableCell>
                        <TableCell>
                          {calculateUnrentedCount(floor.officeSpaces)}
                        </TableCell>
                        <TableCell>
                          {calculateOccupancyRate(floor.officeSpaces)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                  Opprett
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Lag ny</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={handleKontraktClick}>
                                Kontrakt
                              </DropdownMenuItem>
                              <DropdownMenuItem>Faktura</DropdownMenuItem>
                              <DropdownMenuItem>
                                Endre leietaker
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <AddOfficeSpaceSheet floorId={floor.id} />
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild></DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Åpne meny</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <EditFloorDetailsSheet
                                  floorId={floor.id}
                                  currentNumber={floor.number}
                                  currentMaxTotalKvm={floor.maxTotalKvm}
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteFloor(floor.id)}
                              >
                                Slett etasje
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-t-0">
                        <TableCell colSpan={7} className="p-0">
                          <CollapsibleContent asChild>
                            <div className="w-full">
                              <Table className="w-full">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="font-medium">
                                      Navn
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Størrelse
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Løpetid
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Leietaker
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Kontaktperson
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Utleid
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Actions
                                    </TableHead>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          onClick={() =>
                                            handleQuickAdd(floor.id)
                                          }
                                          variant="ghost"
                                          size="icon"
                                        >
                                          <PlusCircle className="mt-4 h-4 w-4 font-medium" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Quick add kontor
                                      </TooltipContent>
                                    </Tooltip>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {floor.officeSpaces &&
                                  floor.officeSpaces.length > 0 ? (
                                    floor.officeSpaces.map((office) => (
                                      <TableRow key={office.id}>
                                        <TableCell>{office.name}</TableCell>
                                        <TableCell>
                                          {office.sizeKvm} KVM
                                        </TableCell>
                                        <TableCell>
                                          {office.leaseDuration || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {office.tenants &&
                                          office.tenants.length > 0
                                            ? office.tenants
                                                .map((tenant) => tenant.name)
                                                .join(", ")
                                            : "Ingen"}
                                        </TableCell>
                                        <TableCell>
                                          {office.tenants &&
                                          office.tenants.length > 0
                                            ? office.tenants
                                                .flatMap((tenant) =>
                                                  tenant.contacts.map(
                                                    (contact) => contact.name,
                                                  ),
                                                )
                                                .join(", ")
                                            : "Ingen kontaktperson"}
                                        </TableCell>
                                        <TableCell>
                                          {office.isRented ? "Ja" : "Nei"}
                                        </TableCell>
                                        <TableCell>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                              >
                                                <span className="sr-only">
                                                  Åpne meny
                                                </span>
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuLabel>
                                                Valg
                                              </DropdownMenuLabel>
                                              <DropdownMenuItem asChild>
                                                <EditOfficeSpaceSheet
                                                  officeId={office.id}
                                                  currentName={office.name}
                                                  currentSizeKvm={
                                                    office.sizeKvm
                                                  }
                                                  currentIsRented={
                                                    office.isRented
                                                  }
                                                />
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  navigator.clipboard.writeText(
                                                    office.name,
                                                  )
                                                }
                                              >
                                                Kopier navn
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem>
                                                View customer
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleQuickDelete(office.id)
                                                }
                                              >
                                                Delete
                                                <DropdownMenuShortcut>
                                                  ⌘⌫
                                                </DropdownMenuShortcut>
                                              </DropdownMenuItem>
                                              <DropdownMenuItem asChild>
                                                <SeeTenantsComboBox
                                                  officeSpaceId={office.id}
                                                  workspaceId={propertyId}
                                                />
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </TableCell>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              onClick={() =>
                                                handleQuickDelete(office.id)
                                              }
                                              variant="ghost"
                                              size="icon"
                                            >
                                              <MinusCircle className="mt-4 h-4 w-4 font-medium" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Slett kontor
                                          </TooltipContent>
                                        </Tooltip>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={7}>
                                        Legg til kontorer
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </CollapsibleContent>
                        </TableCell>
                      </TableRow>
                    </>
                  </Collapsible>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
