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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form"
import { Input } from "@propdock/ui/components/input"
import { Percent } from "lucide-react" // Add this import
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
  kpi1: z
    .string()
    .nonempty("KPI 1 er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "KPI 1 må være et tall mellom 0 og 100.",
      },
    ),
  kpi2: z
    .string()
    .nonempty("KPI 2 er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "KPI 2 må være et tall mellom 0 og 100.",
      },
    ),
  kpi3: z
    .string()
    .nonempty("KPI 3 er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "KPI 3 må være et tall mellom 0 og 100.",
      },
    ),
  kpi4: z
    .string()
    .nonempty("KPI 4 er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "KPI 4 må være et tall mellom 0 og 100.",
      },
    ),
})

interface EditKpiCardProps {
  analysisId: string
  initialKpi1: number
  initialKpi2: number
  initialKpi3: number
  initialKpi4: number
}

export function EditKpiCard({
  analysisId,
  initialKpi1,
  initialKpi2,
  initialKpi3,
  initialKpi4,
}: EditKpiCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kpi1: (initialKpi1 * 100).toString(),
      kpi2: (initialKpi2 * 100).toString(),
      kpi3: (initialKpi3 * 100).toString(),
      kpi4: (initialKpi4 * 100).toString(),
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        kpi1: Number(data.kpi1) / 100,
        kpi2: Number(data.kpi2) / 100,
        kpi3: Number(data.kpi3) / 100,
        kpi4: Number(data.kpi4) / 100,
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
        <CardTitle>KPI-verdier</CardTitle>
        <CardDescription>Rediger KPI-verdiene.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <FormField
                control={form.control}
                name="kpi1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KPI 1</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="text" placeholder="KPI 1" {...field} />
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
                name="kpi2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KPI 2</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="text" placeholder="KPI 2" {...field} />
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
                name="kpi3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KPI 3</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="text" placeholder="KPI 3" {...field} />
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
                name="kpi4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KPI 4</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="text" placeholder="KPI 4" {...field} />
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
