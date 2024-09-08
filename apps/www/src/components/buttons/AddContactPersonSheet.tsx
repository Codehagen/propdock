"use client";

import { createContactPerson } from "@/actions/create-contact-person";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form";
import { Input } from "@propdock/ui/components/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@propdock/ui/components/sheet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the validation schema
const ContactPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  fnr: z
    .string()
    .optional()
    .refine((data) => !data || /^\d{11}$/.test(data), {
      message: "fnr must be exactly 11 digits",
    })
    .nullable(),
});

export function AddContactPersonSheet({ tenantId, currentPath }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(ContactPersonSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      fnr: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await createContactPerson(tenantId, data, currentPath);

      if (!result.success) {
        throw new Error(result.error || "Failed to save contact person.");
      }

      toast.success(`Kontaktperson "${data.name}" ble lagret.`);
      form.reset();
      setIsOpen(false); // Close the sheet on success
      // Revalidate the path to refresh the page or update the state to show the new contact person
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Legg til ny kontaktperson</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny kontaktperson</SheetTitle>
          <SheetDescription>
            Legg til en ny kontaktperson for leietakeren
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
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
                  <FormLabel>Telefon</FormLabel>
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
                    <Input placeholder="FNR..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Lagrer..." : "Lagre ny kontaktperson"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
