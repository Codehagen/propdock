"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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
        <div className="flex w-full space-x-2 md:w-[500px]">
          <Link href={`/tenant/${row.original.id}`}>
            <span className="truncate font-medium">{row.original.name}</span>
          </Link>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const name = row.original.name

      return (
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Valg</DropdownMenuLabel>
              <DropdownMenuItem>Endre</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(name)}
              >
                Kopier navn
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
