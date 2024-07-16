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
    .nonempty("Market Rent Office is required.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Market Rent Office must be a number.",
    }),
  marketRentMerch: z
    .string()
    .nonempty("Market Rent Merch is required.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Market Rent Merch must be a number.",
    }),
  marketRentMisc: z
    .string()
    .nonempty("Market Rent Misc is required.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Market Rent Misc must be a number.",
    }),
  usePrimeYield: z.boolean().default(false).optional(),
  manYieldOffice: z
    .string()
    .nonempty("Manual Yield Office is required.")
    .optional(),
  manYieldMerch: z
    .string()
    .nonempty("Manual Yield Merch is required.")
    .optional(),
  manYieldMisc: z
    .string()
    .nonempty("Manual Yield Misc is required.")
    .optional(),
  manYieldWeighted: z
    .string()
    .nonempty("Manual Yield Weighted is required.")
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
        toast.success("Analysis updated successfully.")
      } else {
        throw new Error(result.error || "Failed to update analysis.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Error updating analysis:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Data</CardTitle>
        <CardDescription>Edit market rent and yield data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="marketRentOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Rent Office</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Market Rent Office"
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
                  <FormLabel>Market Rent Merch</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Market Rent Merch"
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
                  <FormLabel>Market Rent Misc</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Market Rent Misc"
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
                  <FormLabel>Use Prime Yield</FormLabel>
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
                      <FormLabel>Manual Yield Office</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manual Yield Office"
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
                      <FormLabel>Manual Yield Merch</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manual Yield Merch"
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
                      <FormLabel>Manual Yield Misc</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manual Yield Misc"
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
                      <FormLabel>Manual Yield Weighted</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Manual Yield Weighted"
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
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
