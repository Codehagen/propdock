"use client"

import { useState } from "react"
import { updateAnalysis } from "@/actions/update-analysis"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@propdock/ui/components/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form"
import { Input } from "@propdock/ui/components/input"
import { Switch } from "@propdock/ui/components/switch"
import { Percent } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
  useCalcROI: z.boolean().default(false).optional(),
  roiWeightedYield: z
    .string()
    .nonempty("Vektet yield er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "Vektet yield må være et tall mellom 0 og 100.",
      },
    )
    .optional(),
  roiInflation: z
    .string()
    .nonempty("Inflasjon er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "Inflasjon må være et tall mellom 0 og 100.",
      },
    )
    .optional(),
  roiCalculated: z
    .string()
    .nonempty("Beregnet ROI er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "Beregnet ROI må være et tall mellom 0 og 100.",
      },
    )
    .optional(),
  roiManual: z
    .string()
    .nonempty("Manuell ROI er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "Manuell ROI må være et tall mellom 0 og 100.",
      },
    )
    .optional(),
})

interface EditROICardProps {
  analysisId: string
  initialUseCalcROI: boolean
  initialROIWeightedYield?: number
  initialROIInflation?: number
  initialROICalculated?: number
  initialROIManual?: number
}

export function EditROICard({
  analysisId,
  initialUseCalcROI,
  initialROIWeightedYield,
  initialROIInflation,
  initialROICalculated,
  initialROIManual,
}: EditROICardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      useCalcROI: initialUseCalcROI,
      roiWeightedYield: initialROIWeightedYield
        ? (initialROIWeightedYield * 100).toString()
        : "",
      roiInflation: initialROIInflation
        ? (initialROIInflation * 100).toString()
        : "",
      roiCalculated: initialROICalculated
        ? (initialROICalculated * 100).toString()
        : "",
      roiManual: initialROIManual ? (initialROIManual * 100).toString() : "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        useCalcROI: data.useCalcROI,
        roiWeightedYield: data.roiWeightedYield
          ? Number(data.roiWeightedYield) / 100
          : undefined,
        roiInflation: data.roiInflation
          ? Number(data.roiInflation) / 100
          : undefined,
        roiCalculated: data.roiCalculated
          ? Number(data.roiCalculated) / 100
          : undefined,
        roiManual: data.roiManual ? Number(data.roiManual) / 100 : undefined,
      })
      if (result.success) {
        toast.success("Analysen ble oppdatert.")
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere analysen.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Feil ved oppdatering av analyse:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avkastning</CardTitle>
        <CardDescription>
          Angi metode for beregning av avkastingskrav.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="useCalcROI"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div>
                    <FormLabel>Bruk beregnet Yield</FormLabel>
                    <FormDescription>
                      Velg mellom manuell yield eller beregnet yield.
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
            {form.watch("useCalcROI") ? (
              <>
                <FormField
                  control={form.control}
                  name="roiWeightedYield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vektet yield</FormLabel>
                      <FormDescription>
                        Den gjennomsnittlige avkastningen for eiendommen,
                        justert for ulike faktorer.
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="F.eks. 5.5"
                            {...field}
                          />
                          <Percent
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                            size={16}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roiInflation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inflasjon</FormLabel>
                      <FormDescription>
                        Forventet årlig prisstigning som påvirker avkastningen.
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="F.eks. 2.5"
                            {...field}
                          />
                          <Percent
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                            size={16}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roiCalculated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beregnet Yield</FormLabel>
                      <FormDescription>
                        Den totale beregnede avkastningen basert på yield og
                        inflasjon.
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Beregnet ROI"
                            {...field}
                          />
                          <Percent
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                            size={16}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="roiManual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manuell Yield</FormLabel>
                    <FormDescription>
                      Angi en manuell Yield / Avkastingskrav.
                    </FormDescription>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="F.eks. 7.5"
                          {...field}
                        />
                        <Percent
                          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                          size={16}
                        />
                      </div>
                    </FormControl>
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
  )
}
