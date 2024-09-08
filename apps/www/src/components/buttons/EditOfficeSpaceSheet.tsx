"use client";

import { updateOfficeSpace } from "@/actions/update-office-space";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import { Checkbox } from "@propdock/ui/components/checkbox";
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
const EditOfficeSpaceSchema = z.object({
  name: z.string().min(1, "Office space name is required"),
  sizeKvm: z.number().min(1, "Size in KVM is required"),
  isRented: z.boolean(),
});

export function EditOfficeSpaceSheet({
  officeId,
  currentName,
  currentSizeKvm,
  currentIsRented,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(EditOfficeSpaceSchema),
    defaultValues: {
      name: currentName,
      sizeKvm: currentSizeKvm,
      isRented: currentIsRented,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await updateOfficeSpace(
        officeId,
        data.name,
        data.sizeKvm,
        data.isRented,
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to update office space.");
      }

      toast.success("Office space was updated.");
      form.reset();
      // Optionally, refresh the page or update the state to show the updated office space
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
        <Button variant="ghost">Endre kontor</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Endre kontornavn</SheetTitle>
          <SheetDescription>
            Endre informasjonen om det valgte kontoret.
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
                    <Input placeholder="Kontornavn.." {...field} />
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
                  <FormLabel>Størrelse (KVM)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Hvor mange kvm er kontoret..."
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel>Er utleid</FormLabel>
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
                {isLoading ? "Lagrer..." : "Lagre"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
