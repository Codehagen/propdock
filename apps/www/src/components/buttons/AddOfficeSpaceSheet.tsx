"use client";

import { createOfficeSpace } from "@/actions/create-office-space";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import { Checkbox } from "@propdock/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@propdock/ui/components/form";
import { Input } from "@propdock/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@propdock/ui/components/sheet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the validation schema
const OfficeSpaceSchema = z.object({
  name: z.string().min(1, "Office space name is required"),
  sizeKvm: z.number().min(1, "Size in KVM is required"),
  isRented: z.boolean()
});

export function AddOfficeSpaceSheet({ floorId }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(OfficeSpaceSchema),
    defaultValues: {
      name: "",
      sizeKvm: "",
      isRented: false
    }
  });

  const onSubmit = async data => {
    setIsLoading(true);

    try {
      // Convert sizeKvm to a number
      const formData = {
        ...data,
        sizeKvm: Number(data.sizeKvm)
      };

      const result = await createOfficeSpace(floorId, formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to save office space.");
      }

      toast.success(`Office space "${formData.name}" was saved.`);
      form.reset();
      // Optionally, refresh the page or update the state to show the new office space
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Legg til nytt kontor</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til nytt kontor</SheetTitle>
          <SheetDescription>
            Fyll ut informasjonen for det nye kontoret.
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
                    <Input placeholder="Navn til kontoret.." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeKvm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Størrelse</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Hvor mange kvm er kontoret..."
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isRented"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Rented</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Saving..." : "Save new office space"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
