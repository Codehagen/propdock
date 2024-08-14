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

const FormSchema = z.object({
  annualRent: z.number().min(0, "Årlig leie må være et positivt tall."),
  otherIncome: z.number().min(0, "Andre inntekter må være et positivt tall."),
})

interface EditIncomeCardProps {
  analysisId: number
  initialAnnualRent: number
  initialOtherIncome: number
}

export function EditIncomeCard({
  analysisId,
  initialAnnualRent,
  initialOtherIncome,
}: EditIncomeCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      annualRent: initialAnnualRent,
      otherIncome: initialOtherIncome,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        annualRent: data.annualRent,
        otherIncome: data.otherIncome,
      })
      if (result.success) {
        toast.success("Inntekter ble oppdatert.")
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere inntekter.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Feil ved oppdatering av inntekter:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inntekter</CardTitle>
        <CardDescription>
          Oppdater årlig leie og andre inntekter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="annualRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Årlig leie</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andre inntekter</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
