"use client";

import { updateAnalysis } from "@/actions/update-analysis";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@propdock/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@propdock/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@propdock/ui/components/form";
import { Input } from "@propdock/ui/components/input";
import { Separator } from "@propdock/ui/components/separator";
import { Switch } from "@propdock/ui/components/switch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  ownerCostsMethod: z.boolean().default(false),
  ownerCostsManual: z.number().nonnegative().nullable(),
  costMaintenance: z.number().nonnegative().nullable(),
  costInsurance: z.number().nonnegative().nullable(),
  costRevision: z.number().nonnegative().nullable(),
  costAdm: z.number().nonnegative().nullable(),
  costOther: z.number().nonnegative().nullable(),
  costNegotiation: z.number().nonnegative().nullable(),
  costLegalFees: z.number().nonnegative().nullable(),
  costConsultFees: z.number().nonnegative().nullable(),
  costAssetMgmt: z.number().nonnegative().nullable(),
  costSum: z.number().nonnegative().nullable()
});

interface EditOwnerCostsCardProps {
  analysisId: string;
  initialOwnerCostsMethod: boolean;
  initialOwnerCostsManual?: number;
  initialCostMaintenance?: number;
  initialCostInsurance?: number;
  initialCostRevision?: number;
  initialCostAdm?: number;
  initialCostOther?: number;
  initialCostNegotiation?: number;
  initialCostLegalFees?: number;
  initialCostConsultFees?: number;
  initialCostAssetMgmt?: number;
  initialCostSum?: number;
}

export function EditOwnerCostsCard({
  analysisId,
  initialOwnerCostsMethod,
  initialOwnerCostsManual,
  initialCostMaintenance,
  initialCostInsurance,
  initialCostRevision,
  initialCostAdm,
  initialCostOther,
  initialCostNegotiation,
  initialCostLegalFees,
  initialCostConsultFees,
  initialCostAssetMgmt,
  initialCostSum
}: EditOwnerCostsCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ownerCostsMethod: initialOwnerCostsMethod,
      ownerCostsManual: initialOwnerCostsManual ?? null,
      costMaintenance: initialCostMaintenance ?? null,
      costInsurance: initialCostInsurance ?? null,
      costRevision: initialCostRevision ?? null,
      costAdm: initialCostAdm ?? null,
      costOther: initialCostOther ?? null,
      costNegotiation: initialCostNegotiation ?? null,
      costLegalFees: initialCostLegalFees ?? null,
      costConsultFees: initialCostConsultFees ?? null,
      costAssetMgmt: initialCostAssetMgmt ?? null,
      costSum: initialCostSum ?? null
    }
  });

  // Add this useEffect to calculate and update costSum
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name && name !== "costSum" && type === "change") {
        const sum = [
          "costMaintenance",
          "costInsurance",
          "costRevision",
          "costAdm",
          "costOther",
          "costNegotiation",
          "costLegalFees",
          "costConsultFees",
          "costAssetMgmt"
        ].reduce((acc, field) => acc + (value[field] || 0), 0);

        form.setValue("costSum", sum);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const result = await updateAnalysis(analysisId, {
        costs: {
          update: {
            ownerCostsMethod: data.ownerCostsMethod,
            ownerCostsManual: data.ownerCostsManual,
            costMaintenance: data.costMaintenance,
            costInsurance: data.costInsurance,
            costRevision: data.costRevision,
            costAdm: data.costAdm,
            costOther: data.costOther,
            costNegotiation: data.costNegotiation,
            costLegalFees: data.costLegalFees,
            costConsultFees: data.costConsultFees,
            costAssetMgmt: data.costAssetMgmt,
            costSum: data.costSum
          }
        }
      });

      if (result.success) {
        toast.success("Analysen ble oppdatert.");
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere analysen.");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Feil ved oppdatering av analyse:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const costFields = [
    {
      name: "costMaintenance",
      label: "Vedlikeholdskostnader",
      description: "Årlige kostnader for vedlikehold av eiendommen"
    },
    {
      name: "costInsurance",
      label: "Forsikringskostnader",
      description: "Årlige forsikringspremier for eiendommen"
    },
    {
      name: "costRevision",
      label: "Revisjonskostnader",
      description: "Årlige kostnader for revisjon av regnskapet"
    },
    {
      name: "costAdm",
      label: "Administrasjonskostnader",
      description: "Årlige kostnader for administrasjon av eiendommen"
    },
    {
      name: "costOther",
      label: "Andre kostnader",
      description: "Diverse andre årlige kostnader knyttet til eiendommen"
    },
    {
      name: "costNegotiation",
      label: "Forhandlingskostnader",
      description: "Kostnader knyttet til forhandlinger og avtaler"
    },
    {
      name: "costLegalFees",
      label: "Juridiske kostnader",
      description: "Årlige kostnader for juridisk rådgivning og tjenester"
    },
    {
      name: "costConsultFees",
      label: "Konsulentkostnader",
      description: "Årlige kostnader for konsulentbistand"
    },
    {
      name: "costAssetMgmt",
      label: "Forvaltningskostnader",
      description: "Årlige kostnader for eiendomsforvaltning"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eierkostnader</CardTitle>
        <CardDescription>
          Rediger eierkostnader og relaterte verdier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ownerCostsMethod"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Eierkostnadsmetode
                    </FormLabel>
                    <FormDescription>
                      Velg mellom manuell eller detaljert kostnadsberegning
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
            <Separator />
            {form.watch("ownerCostsMethod") ? (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Detaljerte kostnader</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {costFields.map(cost => (
                    <FormField
                      key={cost.name}
                      control={form.control}
                      name={cost.name as keyof z.infer<typeof FormSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{cost.label}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={cost.label}
                              {...field}
                              value={field.value ?? ""}
                              onChange={e =>
                                field.onChange(
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>{cost.description}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="costSum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sum kostnader</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Sum kostnader"
                          {...field}
                          disabled
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Total sum av alle eierkostnader (automatisk beregnet)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="ownerCostsManual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manuelle eierkostnader</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Manuelle eierkostnader"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Angi totale årlige eierkostnader manuelt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
