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
import { Separator } from "@propdock/ui/components/separator"
import { Switch } from "@propdock/ui/components/switch"
import { Percent } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
  marketRentOffice: z.string().nonempty("Markedsleie kontor er påkrevd."),
  marketRentMerch: z.string().nonempty("Markedsleie handel er påkrevd."),
  marketRentMisc: z.string().nonempty("Markedsleie annet er påkrevd."),
  usePrimeYield: z.boolean(),
  manYieldOffice: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100),
      { message: "Yield kontor må være et tall mellom 0 og 100." },
    ),
  manYieldMerch: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100),
      { message: "Yield handel må være et tall mellom 0 og 100." },
    ),
  manYieldMisc: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100),
      { message: "Yield annet må være et tall mellom 0 og 100." },
    ),
  manYieldWeighted: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100),
      { message: "Vektet yield må være et tall mellom 0 og 100." },
    ),
})

interface EditMarketDataCardProps {
  analysisId: string
  initialMarketRentOffice: number
  initialMarketRentMerch: number
  initialMarketRentMisc: number
  initialUsePrimeYield: boolean
  initialManYieldOffice?: number
  initialManYieldMerch?: number
  initialManYieldMisc?: number
  initialManYieldWeighted?: number
}

export function EditMarketDataCard({
  analysisId,
  initialMarketRentOffice,
  initialMarketRentMerch,
  initialMarketRentMisc,
  initialUsePrimeYield,
  initialManYieldOffice,
  initialManYieldMerch,
  initialManYieldMisc,
  initialManYieldWeighted,
}: EditMarketDataCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marketRentOffice: initialMarketRentOffice.toString(),
      marketRentMerch: initialMarketRentMerch.toString(),
      marketRentMisc: initialMarketRentMisc.toString(),
      usePrimeYield: initialUsePrimeYield,
      manYieldOffice: initialManYieldOffice
        ? (initialManYieldOffice * 100).toString()
        : "",
      manYieldMerch: initialManYieldMerch
        ? (initialManYieldMerch * 100).toString()
        : "",
      manYieldMisc: initialManYieldMisc
        ? (initialManYieldMisc * 100).toString()
        : "",
      manYieldWeighted: initialManYieldWeighted
        ? (initialManYieldWeighted * 100).toString()
        : "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        marketRentOffice: Number(data.marketRentOffice),
        marketRentMerch: Number(data.marketRentMerch),
        marketRentMisc: Number(data.marketRentMisc),
        usePrimeYield: data.usePrimeYield,
        manYieldOffice: data.manYieldOffice
          ? Number(data.manYieldOffice) / 100
          : undefined,
        manYieldMerch: data.manYieldMerch
          ? Number(data.manYieldMerch) / 100
          : undefined,
        manYieldMisc: data.manYieldMisc
          ? Number(data.manYieldMisc) / 100
          : undefined,
        manYieldWeighted: data.manYieldWeighted
          ? Number(data.manYieldWeighted) / 100
          : undefined,
      })
      if (result.success) {
        toast.success("Markedsdata og prime yield ble oppdatert.")
      } else {
        throw new Error(
          result.error || "Kunne ikke oppdatere markedsdata og prime yield.",
        )
      }
    } catch (error) {
      toast.error(error.message)
      console.error(
        "Feil ved oppdatering av markedsdata og prime yield:",
        error,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const marketRentFields = [
    {
      name: "marketRentOffice",
      label: "Markedsleie kontor",
      description: "Gjennomsnittlig markedsleie for kontorarealer per kvm/år",
    },
    {
      name: "marketRentMerch",
      label: "Markedsleie handel",
      description: "Gjennomsnittlig markedsleie for handelsarealer per kvm/år",
    },
    {
      name: "marketRentMisc",
      label: "Markedsleie annet",
      description: "Gjennomsnittlig markedsleie for andre arealer per kvm/år",
    },
  ]

  const yieldFields = [
    {
      name: "manYieldOffice",
      label: "Yield kontor",
      description: "Prime yield for kontorarealer",
    },
    {
      name: "manYieldMerch",
      label: "Yield handel",
      description: "Prime yield for handelsarealer",
    },
    {
      name: "manYieldMisc",
      label: "Yield annet",
      description: "Prime yield for andre arealer",
    },
    {
      name: "manYieldWeighted",
      label: "Vektet yield",
      description: "Vektet prime yield for alle arealer",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Markedsdata og Prime Yield</CardTitle>
        <CardDescription>
          Rediger markedsleie og prime yield for ulike arealtyper.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium">Markedsleie</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {marketRentFields.map((field) => (
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
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="mb-4 text-lg font-medium">Prime Yield</h3>
              <FormField
                control={form.control}
                name="usePrimeYield"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-row items-center justify-between rounded-lg border p-4">
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
                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="F.eks. 5.5"
                                {...formField}
                              />
                              <Percent
                                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                                size={16}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>{field.description}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
