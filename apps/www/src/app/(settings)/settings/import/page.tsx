import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dingify/ui/components/table"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import TestPowerofficeButton from "@/components/dev/testbuttonpoweroffice"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function ImportPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  const connectors = [
    { name: "Poweroffice", provider: "Poweroffice", status: "Disconnected" },
    { name: "Fiken", provider: "Fiken", status: "Disconnected" },
    { name: "Tripletex", provider: "Tripletex", status: "Disconnected" },
    { name: "X-ledger", provider: "X-ledger", status: "Disconnected" },
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <TestPowerofficeButton />
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b bg-background px-6 py-4">
            <h1 className="text-2xl font-bold">API Connectors</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4" />
                  <span>Select Provider</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Providers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {connectors.map((connector, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="flex items-center justify-between">
                      <span>{connector.provider}</span>
                      <XIcon
                        className={`h-4 w-4 ${connector.status === "Connected" ? "text-green-500" : "text-red-500"}`}
                      />
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Connector Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectors.map((connector, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {connector.name}
                    </TableCell>
                    <TableCell>{connector.provider}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          connector.status === "Connected"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {connector.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {connector.status === "Connected"
                          ? "Disconnect"
                          : "Connect"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
