"use client";

import { useState } from "react";
import { createBuilding } from "@/actions/create-building";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@dingify/ui/components/button";
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
const BuildingSchema = z.object({
  name: z.string().min(1, "Building Name is required"),
  address: z.string().optional(),
  gnr: z.string().optional(),
  bnr: z.string().optional(),
  snr: z.string().optional(),
  fnr: z.string().optional(),
});

export function AddBuildingSheet({ propertyId }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(BuildingSchema),
    defaultValues: {
      name: "",
      address: "",
      gnr: undefined,
      bnr: undefined,
      snr: undefined,
      fnr: undefined,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Convert string inputs to numbers
    const convertedData = {
      ...data,
      gnr: data.gnr ? parseInt(data.gnr, 10) : undefined,
      bnr: data.bnr ? parseInt(data.bnr, 10) : undefined,
      snr: data.snr ? parseInt(data.snr, 10) : undefined,
      fnr: data.fnr ? parseInt(data.fnr, 10) : undefined,
    };

    try {
      const result = await createBuilding(propertyId, convertedData);

      if (!result.success) {
        throw new Error(result.error || "Failed to save building.");
      }

      toast.success(`Byggningen "${data.name}" ble lagret.`);
      form.reset();
      // Optionally, refresh the page or update the state to show the new building
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
        <Button variant="outline">Legg til ny byggning</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny bygning</SheetTitle>
          <SheetDescription>
            Legg til byggninger som hører til {propertyId}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Building Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="GNR..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="BNR..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="snr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="SNR..." {...field} />
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
                  <FormLabel>FNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="FNR..." {...field} />
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
                {isLoading ? "Saving..." : "Save new building"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
