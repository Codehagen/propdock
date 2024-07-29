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
  marketRentOffice: z
    .string()
    .nonempty("Markedsleie kontor er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Markedsleie kontor må være et tall.",
    }),
  marketRentMerch: z
    .string()
    .nonempty("Markedsleie handel er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Markedsleie handel må være et tall.",
    }),
  marketRentMisc: z
    .string()
    .nonempty("Markedsleie annet er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Markedsleie annet må være et tall.",
    }),
  usePrimeYield: z.boolean().default(false).optional(),
  manYieldOffice: z
    .string()
    .nonempty("Manuell yield kontor er påkrevd.")
    .optional(),
  manYieldMerch: z
    .string()
    .nonempty("Manuell yield handel er påkrevd.")
    .optional(),
  manYieldMisc: z
    .string()
    .nonempty("Manuell yield annet er påkrevd.")
    .optional(),
  manYieldWeighted: z
    .string()
    .nonempty("Manuell vektet yield er påkrevd.")
    .optional(),
})

interface EditMarketDataCardProps {
  analysisId: number
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
      manYieldOffice: initialManYieldOffice?.toString() || "",
      manYieldMerch: initialManYieldMerch?.toString() || "",
      manYieldMisc: initialManYieldMisc?.toString() || "",
      manYieldWeighted: initialManYieldWeighted?.toString() || "",
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
          ? Number(data.manYieldOffice)
          : undefined,
        manYieldMerch: data.manYieldMerch
          ? Number(data.manYieldMerch)
          : undefined,
        manYieldMisc: data.manYieldMisc ? Number(data.manYieldMisc) : undefined,
        manYieldWeighted: data.manYieldWeighted
          ? Number(data.manYieldWeighted)
          : undefined,
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
        <CardTitle>Markedsdata</CardTitle>
        <CardDescription>Rediger markedsleie og yield-data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="marketRentOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markedsleie kontor</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Markedsleie kontor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketRentMerch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markedsleie handel</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Markedsleie handel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketRentMisc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Markedsleie annet</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Markedsleie annet"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usePrimeYield"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Bruk prime yield</FormLabel>
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
              <>
                <FormField
                  control={form.control}
                  name="manYieldOffice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manuell yield kontor</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manuell yield kontor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manYieldMerch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manuell yield handel</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manuell yield handel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manYieldMisc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manuell yield annet</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manuell yield annet"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manYieldWeighted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manuell vektet yield</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manuell vektet yield"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
