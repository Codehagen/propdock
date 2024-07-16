import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import TestPowerofficeButton from "@/components/dev/testbuttonpoweroffice"
import { UserMobileForm } from "@/components/forms/user-mobile-form" // Import UserMobileForm
import { UserNameForm } from "@/components/forms/user-name-form"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function ImportPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  // const user = await prisma.user.findUnique({
  //   where: { id: session.user.id },
  //   select: {
  //     id: true,
  //     name: true,
  //     email: true,
  //     phone: true, // Include phone here
  //   },
  // })

  // if (!user) {
  //   redirect(authOptions.pages?.signIn || "/login")
  // }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <TestPowerofficeButton />
      </div>
    </DashboardShell>
  )
}
