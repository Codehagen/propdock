"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { deleteTenant } from "@/actions/delete-tenant"
import format from "date-fns/format"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@dingify/ui/components/badge"
import { Button } from "@dingify/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@dingify/ui/components/dropdown-menu"

import { EditTenantSheet } from "@/components/buttons/EditTenantSheet"

export interface tenants {
  name: string
  id: number
  building: {
    name: string
  }
  floor: {
    number: number
  } | null
  officeSpace: {
    name: string
  } | null
  orgnr: number | null
  numEmployees: number
  isRenting: boolean
  currentRent: number | null
  contractStartDate: string | null
  contractEndDate: string | null
}

export const TenantColumns: ColumnDef<tenants>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Navn
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-full space-x-2 md:w-[250px]">
          <Link href={`/tenant/${row.original.id}`}>
            <span className="truncate font-medium">{row.original.name}</span>
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "isRenting",
    header: "Leiestatus",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isRenting") ? "default" : "secondary"}>
        {row.getValue("isRenting") ? "Leier" : "Leier ikke"}
      </Badge>
    ),
  },
  {
    accessorKey: "currentRent",
    header: "Nåværende leie",
    cell: ({ row }) => {
      const amount = row.getValue("currentRent")
      return amount ? (
        `${amount.toLocaleString()} NOK`
      ) : (
        <Badge variant="secondary">Ingen leie</Badge>
      )
    },
  },
  {
    accessorKey: "contractStartDate",
    header: "Kontraktstart",
    cell: ({ row }) => {
      const date = row.getValue("contractStartDate")
      return date ? (
        format(new Date(date), "dd.MM.yyyy")
      ) : (
        <Badge variant="secondary">Ingen dato</Badge>
      )
    },
  },
  {
    accessorKey: "contractEndDate",
    header: "Kontraktslutt",
    cell: ({ row }) => {
      const date = row.getValue("contractEndDate")
      return date ? (
        format(new Date(date), "dd.MM.yyyy")
      ) : (
        <Badge variant="secondary">Ingen dato</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const name = row.original.name
      const id = row.original.id

      const handleDelete = async () => {
        const result = await deleteTenant(id.toString())
        if (result.success) {
          toast.success(`Leietaker "${name}" ble slettet`)
        } else {
          toast.error(`Kunne ikke slette leietaker "${name}"`)
        }
      }

      return (
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Åpne meny</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
              <EditTenantSheet tenant={row.original}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Rediger
                </DropdownMenuItem>
              </EditTenantSheet>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>
                Slett
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
