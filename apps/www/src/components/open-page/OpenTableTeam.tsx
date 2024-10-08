"use client"

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import * as React from "react"
import { Button } from "@propdock/ui/components/button"
import { Checkbox } from "@propdock/ui/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@propdock/ui/components/dropdown-menu"
import { Input } from "@propdock/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

const data: TeamMember[] = [
  {
    id: "1",
    name: "Christer Hagen",
    role: "Founder, CEO",
    salary: "0 kr",
    engagement: "Full-Time",
    location: "Bodø, Norge",
    joinDate: "10 Juni 2024",
  },
  {
    id: "2",
    name: "Vegard Soraas",
    role: "CTO",
    salary: "0 kr",
    engagement: "Full-Time",
    location: "Fauske, Norge",
    joinDate: "20 Juni 2024",
  },
]

export interface TeamMember {
  id: string
  name: string
  role: string
  salary: string
  engagement: string
  location: string
  joinDate: string
}

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: "Navn",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "role",
    header: "Rolle",
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "salary",
    header: "Lønn",
    cell: ({ row }) => <div>{row.getValue("salary")}</div>,
  },
  {
    accessorKey: "engagement",
    header: "Engagement",
    cell: ({ row }) => <div>{row.getValue("engagement")}</div>,
  },
  {
    accessorKey: "location",
    header: "Lokasjon",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ row }) => <div>{row.getValue("joinDate")}</div>,
  },
]

export function OpenTableTeam() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="mb-4 text-left font-heading text-xl leading-[1.1]">
          Team
        </h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
