"use client";

import { updateAnalysis } from "@/actions/update-analysis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card";
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
import { Switch } from "@propdock/ui/components/switch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  usePrimeYield: z.boolean().default(false),
  manYieldOffice: z.string().optional(),
  manYieldMerch: z.string().optional(),
  manYieldMisc: z.string().optional(),
  manYieldWeighted: z.string().optional(),
});

interface EditPrimeYieldCardProps {
  analysisId: string;
  initialUsePrimeYield: boolean;
  initialManYieldOffice?: number;
  initialManYieldMerch?: number;
  initialManYieldMisc?: number;
  initialManYieldWeighted?: number;
}

export function EditPrimeYieldCard({
  analysisId,
  initialUsePrimeYield,
  initialManYieldOffice,
  initialManYieldMerch,
  initialManYieldMisc,
  initialManYieldWeighted,
}: EditPrimeYieldCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usePrimeYield: initialUsePrimeYield,
      manYieldOffice: initialManYieldOffice?.toString() || "",
      manYieldMerch: initialManYieldMerch?.toString() || "",
      manYieldMisc: initialManYieldMisc?.toString() || "",
      manYieldWeighted: initialManYieldWeighted?.toString() || "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const result = await updateAnalysis(analysisId, {
        usePrimeYield: data.usePrimeYield,
        manYieldOffice: data.manYieldOffice
          ? Number(data.manYieldOffice)
          : undefined,
        manYieldMerch: data.manYieldMerch
          ? Number(data.manYieldMerch)
          : undefined,
        manYieldMisc: data.manYieldMisc ? Number(data.manYieldMisc) : undefined,
        manYieldWeighted: data.manYieldWeighted
          ? Number(data.manYieldWeighted)
          : undefined,
      });
      if (result.success) {
        toast.success("Prime yield data ble oppdatert.");
      } else {
        throw new Error(
          result.error || "Kunne ikke oppdatere prime yield data.",
        );
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Feil ved oppdatering av prime yield data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const yieldFields = [
    {
      name: "manYieldOffice",
      label: "Yield kontor",
      description: "Prime yield for kontorarealer (i prosent)",
    },
    {
      name: "manYieldMerch",
      label: "Yield handel",
      description: "Prime yield for handelsarealer (i prosent)",
    },
    {
      name: "manYieldMisc",
      label: "Yield annet",
      description: "Prime yield for andre arealer (i prosent)",
    },
    {
      name: "manYieldWeighted",
      label: "Vektet yield",
      description: "Vektet prime yield for alle arealer (i prosent)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prime Yield</CardTitle>
        <CardDescription>
          Angi prime yield data for ulike arealtyper.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="usePrimeYield"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Bruk prime yield
                    </FormLabel>
                    <FormDescription>
                      Aktiver for å bruke prime yield i beregninger
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("usePrimeYield") && (
              <div className="grid gap-4 sm:grid-cols-2">
                {yieldFields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof z.infer<typeof FormSchema>}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={field.label}
                            {...formField}
                            onChange={(e) => formField.onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>{field.description}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
