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
  kpi1: z
    .string()
    .nonempty("KPI 1 er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "KPI 1 må være et tall.",
    }),
  kpi2: z
    .string()
    .nonempty("KPI 2 er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "KPI 2 må være et tall.",
    }),
  kpi3: z
    .string()
    .nonempty("KPI 3 er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "KPI 3 må være et tall.",
    }),
  kpi4: z
    .string()
    .nonempty("KPI 4 er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "KPI 4 må være et tall.",
    }),
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
      kpi1: initialKpi1.toString(),
      kpi2: initialKpi2.toString(),
      kpi3: initialKpi3.toString(),
      kpi4: initialKpi4.toString(),
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        kpi1: Number(data.kpi1),
        kpi2: Number(data.kpi2),
        kpi3: Number(data.kpi3),
        kpi4: Number(data.kpi4),
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
                      <Input type="text" placeholder="KPI 1" {...field} />
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
                      <Input type="text" placeholder="KPI 2" {...field} />
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
                      <Input type="text" placeholder="KPI 3" {...field} />
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
                      <Input type="text" placeholder="KPI 4" {...field} />
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
