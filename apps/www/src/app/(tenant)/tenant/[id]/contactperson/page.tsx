import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export default function ContactPerson() {
  return (
    <div>
      <DashboardShell>
        <DashboardHeader
          heading="Kontaktperson"
          text="Din kontaktperson for leietakeren."
        />
      </DashboardShell>
    </div>
  )
}
