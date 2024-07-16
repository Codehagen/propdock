// pages/settings/api.js
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { Badge } from "@dingify/ui/components/badge"
import { Separator } from "@dingify/ui/components/separator"
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
import { AddApiKeyButton } from "@/components/buttons/AddApiKeyButton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export const metadata = {
  title: "API keys",
  description: "Manage your API keys.",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  const userApiKeys = await prisma.userApiKey.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      secret: true,
      createdAt: true,
      serviceName: true,
    },
  })

  if (!userApiKeys) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <AddApiKeyButton />
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-bold">Your API Keys</h2>
        {userApiKeys.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API Key</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userApiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <Badge variant="outline">{key.secret}</Badge>
                  </TableCell>
                  <TableCell>{key.serviceName}</TableCell>
                  <TableCell>
                    {new Date(key.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>You have no API keys.</p>
        )}
      </div>
    </DashboardShell>
  )
}
