"use client"

import { useEffect, useState } from "react"
import { updateContract } from "@/actions/update-contract" // Import the update function
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form"
import { Input } from "@propdock/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propdock/ui/components/select"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Define validation schema
const ContactSchema = z.object({
  contactId: z.string().optional(),
  name: z.string().min(1, "Navn er påkrevd"),
  email: z.string().min(1, "E-post er påkrevd").email("Ugyldig e-postadresse"),
  phone: z.string().min(1, "Telefon er påkrevd"),
})

export function TenantDetailsForm({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: tenantDetails.contracts[0]?.contactName || "",
      email: tenantDetails.contracts[0]?.contactEmail || "",
      phone: tenantDetails.contracts[0]?.contactPhone || "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const result = await updateContract(tenantDetails.contracts[0].id, {
        contactId: data.contactId ? parseInt(data.contactId) : undefined,
        contactName: data.name,
        contactEmail: data.email,
        contactPhone: data.phone,
      })

      if (!result.success) {
        throw new Error(
          result.error || "Kunne ikke oppdatere kontaktinformasjonen.",
        )
      }

      toast.success("Kontaktinformasjon oppdatert")
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactChange = (value) => {
    const contact = tenantDetails.contacts.find(
      (contact) => contact.id.toString() === value,
    )
    form.setValue("contactId", value)
    form.setValue("name", contact?.name || "")
    form.setValue("email", contact?.email || "")
    form.setValue("phone", contact?.phone || "")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leietakerdetaljer</CardTitle>
        <CardDescription>
          Vis og oppdater kontaktinformasjon for leietakeren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontakt</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleContactChange(value)
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Velg kontakt" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenantDetails.contacts.map((contact) => (
                          <SelectItem
                            key={contact.id}
                            value={contact.id.toString()}
                          >
                            {contact.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input placeholder="Kontaktens navn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input placeholder="Kontaktens e-post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="Kontaktens telefonnummer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
