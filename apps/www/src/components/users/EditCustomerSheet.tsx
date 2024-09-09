// components/sheets/EditCustomerSheet.tsx
"use client";

import { changeCustomerDetails } from "@/actions/Dingify/change-customer-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Pencil, StarIcon, User, UserCog } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export function EditCustomerSheet({ customer }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: customer.name || "",
      email: customer.email || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await changeCustomerDetails(customer.id, data);
      if (result.success) {
        toast.message(
          <div className="flex flex-col">
            <span>Customer Updated.</span>
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          </div>,
        );
        form.reset();
      }
    } catch (error) {
      toast.error("There was an error updating the customer.");
      console.error("Error updating customer:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="px-3 shadow-none">
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Customer</SheetTitle>
          <SheetDescription>Update the customer's details.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
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
                    <Input placeholder="Customer email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
