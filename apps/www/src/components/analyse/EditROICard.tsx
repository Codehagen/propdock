"use client"

import { useState } from "react"
import { updateAnalysis } from "@/actions/update-analysis"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dingify/ui/components/form"
import { Input } from "@dingify/ui/components/input"
import { Switch } from "@dingify/ui/components/switch"

const FormSchema = z.object({
  useCalcROI: z.boolean().default(false).optional(),
  roiWeightedYield: z.string().nonempty("Vektet yield er påkrevd.").optional(),
  roiInflation: z.string().nonempty("Inflasjon er påkrevd.").optional(),
  roiCalculated: z.string().nonempty("Beregnet ROI er påkrevd.").optional(),
  roiManual: z.string().nonempty("Manuell ROI er påkrevd.").optional(),
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
      roiWeightedYield: initialROIWeightedYield?.toString() || "",
      roiInflation: initialROIInflation?.toString() || "",
      roiCalculated: initialROICalculated?.toString() || "",
      roiManual: initialROIManual?.toString() || "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        useCalcROI: data.useCalcROI,
        roiWeightedYield: data.roiWeightedYield
          ? Number(data.roiWeightedYield)
          : undefined,
        roiInflation: data.roiInflation ? Number(data.roiInflation) : undefined,
        roiCalculated: data.roiCalculated
          ? Number(data.roiCalculated)
          : undefined,
        roiManual: data.roiManual ? Number(data.roiManual) : undefined,
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
        <CardTitle>ROI-inndata</CardTitle>
        <CardDescription>
          Rediger ROI-inndata og relaterte verdier.
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
                  <FormLabel>Bruk beregnet ROI</FormLabel>
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
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Vektet yield"
                          {...field}
                        />
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
                      <FormControl>
                        <Input type="text" placeholder="Inflasjon" {...field} />
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
                      <FormLabel>Beregnet ROI</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Beregnet ROI"
                          {...field}
                        />
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
                    <FormLabel>Manuell ROI</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Manuell ROI" {...field} />
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
