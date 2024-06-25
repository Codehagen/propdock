"use client"

import { useState } from "react"
import { deleteContactPerson } from "@/actions/delete-contact-person"
import { updateContactPerson } from "@/actions/update-contact-person"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dingify/ui/components/form"
import { Input } from "@dingify/ui/components/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@dingify/ui/components/sheet"

// Define the validation schema
const ContactPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  fnr: z
    .string()
    .optional()
    .refine((data) => !data || /^\d{11}$/.test(data), {
      message: "Fødselnummer må være 11 siffer",
    })
    .nullable(),
})

export function EditContactPersonSheet({
  contactPersonId,
  initialValues,
  currentPath,
  children,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(ContactPersonSchema),
    defaultValues: initialValues,
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const result = await updateContactPerson(
        contactPersonId,
        data,
        currentPath,
      )

      if (!result.success) {
        throw new Error(result.error || "Failed to update contact person.")
      }

      toast.success(`Kontaktperson "${data.name}" ble oppdatert.`)
      form.reset()
      setIsOpen(false) // Close the sheet on success
      // Optionally, refresh the page or update the state to show the updated contact person
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async () => {
    setIsLoading(true)

    try {
      const result = await deleteContactPerson(contactPersonId, currentPath)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete contact person.")
      }

      toast.success("Kontaktperson ble slettet.")
      setIsOpen(false) // Close the sheet on success
      // Optionally, refresh the page or update the state to remove the deleted contact person
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Oppdater kontaktperson</SheetTitle>
          <SheetDescription>
            Oppdater informasjonen for kontaktpersonen
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name..." {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fødselnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="11 siffer..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Hvis du skal sende ut dokumenter for digital signering
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Sletter..." : "Slett "}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Lagrer..." : "Oppdater"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
