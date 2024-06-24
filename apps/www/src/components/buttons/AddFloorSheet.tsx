"use client";

import { useState } from "react";
import { createFloor } from "@/actions/create-floor";
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
const FloorSchema = z.object({
  totalKvm: z.number().min(1, "Total KVM is required"),
  floors: z.number().min(1, "Number of floors is required"),
  splitKvm: z.boolean(),
});

export function AddFloorSheet({ buildingId }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(FloorSchema),
    defaultValues: {
      totalKvm: undefined,
      floors: undefined,
      splitKvm: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const { totalKvm, floors, splitKvm } = data;
    const maxTotalKvm = splitKvm ? totalKvm / floors : totalKvm;

    try {
      if (splitKvm) {
        for (let i = 1; i <= floors; i++) {
          const floorData = {
            number: i,
            maxTotalKvm,
            maxOfficeKvm: 0, // Assuming default value, replace with actual value if needed
            maxCommonKvm: 0, // Assuming default value, replace with actual value if needed
          };
          const result = await createFloor(buildingId, floorData);

          if (!result.success) {
            throw new Error(result.error || "Failed to save floor.");
          }
        }
      } else {
        const floorData = {
          number: floors,
          maxTotalKvm,
          maxOfficeKvm: 0, // Assuming default value, replace with actual value if needed
          maxCommonKvm: 0, // Assuming default value, replace with actual value if needed
        };
        const result = await createFloor(buildingId, floorData);

        if (!result.success) {
          throw new Error(result.error || "Failed to save floor.");
        }
      }

      toast.success(`Floor details were saved.`);
      form.reset();
      // Optionally, refresh the page or update the state to show the new floor
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
        <Button variant="outline">Legg til ny etasje</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny etasje</SheetTitle>
          <SheetDescription>Hvor mange etasjer ønsker du å legge inn? </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit({
                ...data,
                totalKvm: Number(data.totalKvm),
                floors: Number(data.floors),
              }),
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="totalKvm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total KVM</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Total KVM..."
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
              name="floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Floors</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Floors..."
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
              name="splitKvm"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Split KVM among floors</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Saving..." : "Save new floor"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
