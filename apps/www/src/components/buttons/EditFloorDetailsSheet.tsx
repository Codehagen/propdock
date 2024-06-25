"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { updateFloorDetails } from "@/actions/update-floor-details";
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
const EditFloorDetailsSchema = z.object({
  number: z.number().min(1, "Floor number is required"),
  maxTotalKvm: z.number().min(1, "Total KVM is required"),
});

export function EditFloorDetailsSheet({
  floorId,
  currentNumber,
  currentMaxTotalKvm,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(EditFloorDetailsSchema),
    defaultValues: {
      number: currentNumber,
      maxTotalKvm: currentMaxTotalKvm,
    },
  });
  const params = useParams();
  const propertyId = Array.isArray(params.propertyId)
    ? params.propertyId[0]
    : params.propertyId;
  const buildingId = Array.isArray(params.buildingId)
    ? params.buildingId[0]
    : params.buildingId;
  const currentPath = `/property/${propertyId}/building/${buildingId}`;

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await updateFloorDetails(floorId, data, currentPath);

      if (!result.success) {
        throw new Error(result.error || "Failed to update floor details.");
      }

      toast.success(`Floor details updated.`);
      form.reset();
      // Optionally, refresh the page or update the state to show the updated floor details
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
        <Button variant="ghost">Endre etasje</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Endre etasje</SheetTitle>
          <SheetDescription>Endre detaljer for etasjen.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Floor number.."
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
              name="maxTotalKvm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total KVM</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Total KVM.."
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
