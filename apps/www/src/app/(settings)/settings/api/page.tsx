// pages/settings/api.js
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { Separator } from "@dingify/ui/components/separator"

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
      <div>
        <h2>Your API Keys</h2>
        {userApiKeys.length > 0 ? (
          userApiKeys.map((key) => (
            <div key={key.id}>
              <p>API Key: {key.secret}</p>
              <p>Name: {key.serviceName}</p>
              <p>Created At: {key.createdAt.toISOString()}</p>
              <Separator />
            </div>
          ))
        ) : (
          <p>You have no API keys.</p>
        )}
      </div>
    </DashboardShell>
  )
}
