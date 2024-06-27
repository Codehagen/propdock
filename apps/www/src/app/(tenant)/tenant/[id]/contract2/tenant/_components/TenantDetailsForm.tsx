"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dingify/ui/components/form"
import { Input } from "@dingify/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dingify/ui/components/select"

// Definer valideringsskjemaet
const ContactSchema = z.object({
  contactId: z.string().min(1, "Kontakt er påkrevd"),
  name: z.string().min(1, "Navn er påkrevd"),
  email: z.string().min(1, "E-post er påkrevd").email("Ugyldig e-postadresse"),
  phone: z.string().min(1, "Telefon er påkrevd"),
})

export function TenantDetailsForm({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  const form = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      contactId: "",
      name: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (selectedContact) {
      form.setValue("name", selectedContact.name)
      form.setValue("email", selectedContact.email)
      form.setValue("phone", selectedContact.phone)
    }
  }, [selectedContact, form.setValue])

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const result = await submitContactInfo(data)

      if (!result.success) {
        throw new Error(
          result.error || "Kunne ikke sende inn kontaktinformasjon.",
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
    setSelectedContact(contact)
    form.setValue("contactId", value)
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
                      defaultValue={field.value}
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

// Dummy function to simulate form submission
async function submitContactInfo(data) {
  // Simuler en forsinkelse
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 1000)
  })
}
