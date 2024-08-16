"use client"

import { useState } from "react"
import { updateAnalysis } from "@/actions/update-analysis"
import { zodResolver } from "@hookform/resolvers/zod"
import { Percent } from "lucide-react"
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
  rentableArea: z
    .string()
    .nonempty("Utleibart areal er påkrevd.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Utleibart areal må være et tall.",
    }),
  ratioAreaOffice: z
    .string()
    .nonempty("Andel kontorareal er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "Andel kontorareal må være et tall mellom 0 og 100.",
      },
    ),
  ratioAreaMerch: z
    .string()
    .nonempty("Andel handelsareal er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "Andel handelsareal må være et tall mellom 0 og 100.",
      },
    ),
  ratioAreaMisc: z
    .string()
    .nonempty("Andel annet areal er påkrevd.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100,
      {
        message: "Andel annet areal må være et tall mellom 0 og 100.",
      },
    ),
})

interface EditRentableAreaCardProps {
  analysisId: string
  initialRentableArea: number
  initialRatioAreaOffice: number
  initialRatioAreaMerch: number
  initialRatioAreaMisc: number
}

export function EditRentableAreaCard({
  analysisId,
  initialRentableArea,
  initialRatioAreaOffice,
  initialRatioAreaMerch,
  initialRatioAreaMisc,
}: EditRentableAreaCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rentableArea: initialRentableArea.toString(),
      ratioAreaOffice: (initialRatioAreaOffice * 100).toString(),
      ratioAreaMerch: (initialRatioAreaMerch * 100).toString(),
      ratioAreaMisc: (initialRatioAreaMisc * 100).toString(),
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        rentableArea: Number(data.rentableArea),
        ratioAreaOffice: Number(data.ratioAreaOffice) / 100,
        ratioAreaMerch: Number(data.ratioAreaMerch) / 100,
        ratioAreaMisc: Number(data.ratioAreaMisc) / 100,
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
        <CardTitle>Utleibart areal</CardTitle>
        <CardDescription>Rediger utleibart areal og andeler.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rentableArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utleibart areal</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Utleibart areal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ratioAreaOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andel kontorareal</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Andel kontorareal"
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
              name="ratioAreaMerch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andel handelsareal</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Andel handelsareal"
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
              name="ratioAreaMisc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andel annet areal</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Andel annet areal"
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
