import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { UserMobileForm } from "@/components/forms/user-mobile-form"; // Import UserMobileForm
import { UserNameForm } from "@/components/forms/user-name-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings."
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true // Include phone here
    }
  });

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <UserMobileForm user={{ id: user.id, phone: user.phone || "" }} />
      </div>
    </DashboardShell>
  );
}
