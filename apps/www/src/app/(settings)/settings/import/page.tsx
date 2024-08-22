import { redirect } from "next/navigation"
import { getWsApiKeys } from "@/actions/get-ws-api-keys"
import { Badge } from "@propdock/ui/components/badge"
import { Button } from "@propdock/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@propdock/ui/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"
import { ChevronDownIcon, PackageIcon, XIcon } from "lucide-react"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

import ConnectorButton from "./_components/ConnectorButton"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function ImportPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      workspaceId: true,
    },
  })

  if (!user?.workspaceId) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  const { apiKeys } = await getWsApiKeys(user.workspaceId)

  // List of all connectors with their default status
  const connectors = [
    { name: "Poweroffice", provider: "poweroffice", status: "Disconnected" },
    { name: "Fiken", provider: "fiken", status: "Disconnected" },
    { name: "Tripletex", provider: "tripletex", status: "Disconnected" },
    { name: "X-ledger", provider: "x-ledger", status: "Disconnected" },
  ]

  // Update the status of the connectors based on the fetched API keys
  apiKeys.forEach((key) => {
    const connector = connectors.find(
      (c) => c.provider.toLowerCase() === key.serviceName.toLowerCase(),
    )
    if (connector) {
      connector.status = key.isActive ? "Connected" : "Disconnected"
    }
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
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
                        className={`h-4 w-4 ${
                          connector.status === "Connected"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
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
                      <ConnectorButton
                        serviceName={connector.provider}
                        status={connector.status}
                        workspaceId={user.workspaceId}
                      />
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
