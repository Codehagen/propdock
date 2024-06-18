"use client";

import { useState } from "react";
import { createOfficeSpace } from "@/actions/create-office-space";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@dingify/ui/components/button";
import { Checkbox } from "@dingify/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dingify/ui/components/form";
import { Input } from "@dingify/ui/components/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@dingify/ui/components/sheet";

// Define the validation schema
const OfficeSpaceSchema = z.object({
  name: z.string().min(1, "Office space name is required"),
  sizeKvm: z.number().min(1, "Size in KVM is required"),
  isRented: z.boolean(),
});

export function AddOfficeSpaceSheet({ floorId }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(OfficeSpaceSchema),
    defaultValues: {
      name: "",
      sizeKvm: 0,
      isRented: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await createOfficeSpace(floorId, data);

      if (!result.success) {
        throw new Error(result.error || "Failed to save office space.");
      }

      toast.success(`Office space "${data.name}" was saved.`);
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
        <Button variant="outline">Add New Office Space</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Office Space</SheetTitle>
          <SheetDescription>
            Add details for the new office space.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Space Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Office Space Name..." {...field} />
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
                  <FormLabel>Size in KVM</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Size in KVM..."
                      {...field}
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
