"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@dingify/ui/components/badge"
import { Button } from "@dingify/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dingify/ui/components/dropdown-menu"
import { cn } from "@dingify/ui/utils"

import type { SignSchema } from "../data/schema"

import { DataTableColumnHeader } from "./data-table-column-header"
import { format } from "date-fns"
import { nb } from "date-fns/locale"

export const columnsSigning: ColumnDef<SignSchema>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tittel" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
    /*     filterFn: (row, id, value) => {
      console.log(id)
      console.log(value)
      return value.includes(row.getValue(id))
    }, */
  },
    {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Opprettet" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {format(row.getValue("createdAt"), "PPP", { locale: nb })}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "signers", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mottakere" />
    ),
    cell: ({ row }) => {
      const users: SignSchema["signers"] = row.getValue("signers")
      const formatedUsers = users.map(
        (user) =>
          user.fullName ??
          `${user?.signerInfo?.firstName ?? ""} ${user?.signerInfo?.lastName ?? ""}`,
      )
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            {formatedUsers.join("- ")}
          </span>
        </div>
      )
    },
  },
    {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" />
    ),
    cell: ({ row }) => {
      let status: string = row.getValue("status")

      switch (status.toLowerCase()) {
        case "unsigned": {
          status = "Utsendt"
        }
        break
        case "signed": {
         status = "Signert" 
        }
        break
        case "expired": {
          status = "Utgått"
        }
        break
        default: {
          status = "Utsendt"
        }
      }
      
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            <Badge className={cn(status === "Utsendt" ? "bg-orange-500" : status === "Signert" ? "bg-green-600" : status === "Utgått" ? "bg-red-500" : "")}>
            {status}
            </Badge>
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valg" />
    ),
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Meny</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Kopier ID
            </DropdownMenuItem>
            <DropdownMenuItem>Last ned</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Se kontrakt</DropdownMenuItem>
            <DropdownMenuItem>Endre</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
