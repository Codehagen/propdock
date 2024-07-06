import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { AddApiKeyButton } from "@/components/buttons/AddApiKeyButton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { UserMobileForm } from "@/components/forms/user-mobile-form" // Import UserMobileForm
import { UserNameForm } from "@/components/forms/user-name-form"

export const metadata = {
  title: "API keys",
  description: "Manage your API keys.",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      apiKey: true,
    },
  })

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <AddApiKeyButton />
      <p>This is your apiKey: {user.apiKey}</p>
    </DashboardShell>
  )
}
