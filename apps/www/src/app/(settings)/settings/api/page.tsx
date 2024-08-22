// pages/settings/api.js
import { redirect } from "next/navigation"
import { Badge } from "@propdock/ui/components/badge"
import { Separator } from "@propdock/ui/components/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { poweroffice } from "@/lib/poweroffice-sdk"
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
  // const x = await poweroffice.getCustomers()
  // console.log(x)

  // const y = await poweroffice.getCustomer("17763838")
  // console.log(y)

  // const z = await poweroffice.getProducts()
  // console.log(z)

  // const a = await poweroffice.getProduct("20681528")
  // console.log(a)

  // const invoiceData = {
  //   CurrencyCode: "NOK",
  //   CustomerId: 17763838,
  //   SalesOrderLines: [
  //     {
  //       Description: "SDK",
  //       ProductId: 20681521,
  //     },
  //   ],
  // }
  // const invoice = await poweroffice.createInvoice(invoiceData)
  // console.log(invoice)

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
