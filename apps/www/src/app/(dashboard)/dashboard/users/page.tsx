import { getAllCustomersForUser } from "@/actions/Dingify/get-customers-all";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { AllUsersCards } from "@/components/users/AllUsersCard";

export default async function UsersPage({
  params,
}: {
  params: { id: string };
}) {
  const customers = await getAllCustomersForUser();

  return (
    <DashboardShell>
      <DashboardHeader heading="All users" text="All your users in one place" />
      <div>
        <AllUsersCards customerDetails={customers} />
      </div>
    </DashboardShell>
  );
}
