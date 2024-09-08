"use client";

import { Button } from "@propdock/ui/components/button";
import { Checkbox } from "@propdock/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@propdock/ui/components/dropdown-menu";
import { Input } from "@propdock/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@propdock/ui/components/table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import * as React from "react";

const data: SalaryBand[] = [
  {
    id: "1",
    title: "Software Engineer - Intern",
    seniority: "Intern",
    salary: "300,000 NOK"
  },
  {
    id: "2",
    title: "Software Engineer - I",
    seniority: "Junior",
    salary: "600,000 NOK"
  },
  {
    id: "3",
    title: "Software Engineer - II",
    seniority: "Mid",
    salary: "800,000 NOK"
  },
  {
    id: "4",
    title: "Software Engineer - III",
    seniority: "Senior",
    salary: "1,000,000 NOK"
  },
  {
    id: "5",
    title: "Software Engineer - IV",
    seniority: "Principal",
    salary: "1,200,000 NOK"
  },
  {
    id: "6",
    title: "Designer - III",
    seniority: "Senior",
    salary: "1,000,000 NOK"
  },
  {
    id: "7",
    title: "Designer - IV",
    seniority: "Principal",
    salary: "1,200,000 NOK"
  },
  {
    id: "8",
    title: "Marketer - I",
    seniority: "Junior",
    salary: "500,000 NOK"
  },
  { id: "9", title: "Marketer - II", seniority: "Mid", salary: "650,000 NOK" },
  {
    id: "10",
    title: "Marketer - III",
    seniority: "Senior",
    salary: "800,000 NOK"
  }
];

export type SalaryBand = {
  id: string;
  title: string;
  seniority: string;
  salary: string;
};

export const columns: ColumnDef<SalaryBand>[] = [
  {
    accessorKey: "title",
    header: "Tittel",
    cell: ({ row }) => <div>{row.getValue("title")}</div>
  },
  {
    accessorKey: "seniority",
    header: "Erfaringsnivå",
    cell: ({ row }) => <div>{row.getValue("seniority")}</div>
  },
  {
    accessorKey: "salary",
    header: "Lønn",
    cell: ({ row }) => <div>{row.getValue("salary")}</div>
  }
];

export function OpenSalaryTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
      rowSelection
    }
  });

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="mb-4 text-left font-heading text-xl leading-[1.1]">
          Globale Lønnsnivåer
        </h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
                    Ingen resultater.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
