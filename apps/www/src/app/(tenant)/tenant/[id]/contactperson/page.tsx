import { getTenantDetails } from "@/actions/get-tenant-details"
import { Settings } from "lucide-react"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"

import { AddContactPersonSheet } from "@/components/buttons/AddContactPersonSheet"
import { EditContactPersonSheet } from "@/components/buttons/EditContactPersonSheet"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"

export default async function ContactPerson({
  params,
}: {
  params: { id: string }
}) {
  const tenantId = params.id

  if (!tenantId) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Contact Person not found"
          text="Invalid contact person ID."
        />
      </DashboardShell>
    )
  }

  try {
    const tenantDetails = await getTenantDetails(tenantId)

    if (!tenantDetails || tenantDetails.contacts.length === 0) {
      return (
        <DashboardShell>
          <DashboardHeader
            heading="Legg til kontaktpersoner"
            text="Du må først legge til kontatpersoner før du kan se dem her."
          />
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="user" />
            <EmptyPlaceholder.Title>
              Ingen kontaktpersoner
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Legg til kontaktpersoner tilknyttet leietakeren.
            </EmptyPlaceholder.Description>
            <AddContactPersonSheet
              tenantId={tenantDetails?.id}
              currentPath={`/tenant/${tenantId}/contacts`}
            />
          </EmptyPlaceholder>
        </DashboardShell>
      )
    }

    return (
      <DashboardShell>
        <DashboardHeader
          heading={tenantDetails.name}
          text="Detaljer om kontaktpersonene."
        >
          <AddContactPersonSheet
            tenantId={tenantDetails.id}
            currentPath={`/tenant/${tenantId}/contacts`}
          />
        </DashboardHeader>
        <div>
          {tenantDetails.contacts.length === 0 ? (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="user" />
              <EmptyPlaceholder.Title>
                Ingen kontaktpersoner
              </EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                Legg til kontaktpersoner tilknyttet leietakeren.
              </EmptyPlaceholder.Description>
              <AddContactPersonSheet
                tenantId={tenantDetails.id}
                currentPath={`/tenant/${tenantId}/contacts`}
              />
            </EmptyPlaceholder>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tenantDetails.contacts.map((contactPerson) => (
                <Card key={contactPerson.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="flex w-full items-center justify-between">
                      <CardTitle className="text-lg">
                        {contactPerson.name}
                      </CardTitle>
                      <EditContactPersonSheet
                        contactPersonId={contactPerson.id}
                        initialValues={{
                          name: contactPerson.name,
                          email: contactPerson.email,
                          phone: contactPerson.phone,
                          fnr: contactPerson.fnr || "",
                        }}
                        currentPath={`/tenant/${tenantId}/contacts`}
                      >
                        <Button className="h-8 w-8" size="icon" variant="ghost">
                          <Settings className="h-3.5 w-3.5" />
                          <span className="sr-only">More</span>
                        </Button>
                      </EditContactPersonSheet>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Navn</span>
                          <span>{contactPerson.name}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Epost</span>
                          <span>{contactPerson.email}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Telefon</span>
                          <span>{contactPerson.phone}</span>
                        </li>
                        {contactPerson.fnr && (
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Fødselsnummer
                            </span>
                            <span>{contactPerson.fnr}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    )
  } catch (error) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Error" text={error.message} />
      </DashboardShell>
    )
  }
}
