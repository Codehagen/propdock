import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"

import { AddContactPersonSheet } from "../buttons/AddContactPersonSheet"
import { EmptyPlaceholder } from "../shared/empty-placeholder"

export default function UserContactPerson({ tenantDetails }) {
  const contacts = tenantDetails.contacts

  if (!contacts || contacts.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="user" />
        <EmptyPlaceholder.Title>Ingen kontaktperson</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Det er ingen kontaktperson lagt til for denne leietakeren.
        </EmptyPlaceholder.Description>
        <AddContactPersonSheet tenantId={tenantDetails.id} />
      </EmptyPlaceholder>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontaktperson</CardTitle>
        <CardDescription>Hvem er kontaktperson hos leietaker</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {contacts.map((contact, index) => (
            <div key={index} className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-none">Navn</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {contact.name}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-none">Telefon</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {contact.phone || "Ingen telefonnummer"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-none">Epost</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {contact.email || "Ingen epost"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
