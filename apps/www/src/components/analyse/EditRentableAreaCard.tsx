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
  rentableArea: z
    .string()
    .nonempty("Rentable area is required.")
    .refine((value) => !isNaN(Number(value)), {
      message: "Rentable area must be a number.",
    }),
  ratioAreaOffice: z
    .string()
    .nonempty("Ratio Area Office is required.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 1,
      {
        message: "Ratio Area Office must be a number between 0 and 1.",
      },
    ),
  ratioAreaMerch: z
    .string()
    .nonempty("Ratio Area Merch is required.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 1,
      {
        message: "Ratio Area Merch must be a number between 0 and 1.",
      },
    ),
  ratioAreaMisc: z
    .string()
    .nonempty("Ratio Area Misc is required.")
    .refine(
      (value) =>
        !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 1,
      {
        message: "Ratio Area Misc must be a number between 0 and 1.",
      },
    ),
})

interface EditRentableAreaCardProps {
  analysisId: number
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
      ratioAreaOffice: initialRatioAreaOffice.toString(),
      ratioAreaMerch: initialRatioAreaMerch.toString(),
      ratioAreaMisc: initialRatioAreaMisc.toString(),
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        rentableArea: Number(data.rentableArea),
        ratioAreaOffice: Number(data.ratioAreaOffice),
        ratioAreaMerch: Number(data.ratioAreaMerch),
        ratioAreaMisc: Number(data.ratioAreaMisc),
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
        <CardTitle>Rentable Area</CardTitle>
        <CardDescription>Edit rentable area and ratios.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rentableArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rentable Area</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Rentable Area" {...field} />
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
                  <FormLabel>Ratio Area Office</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ratio Area Office"
                      {...field}
                    />
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
                  <FormLabel>Ratio Area Merch</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ratio Area Merch"
                      {...field}
                    />
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
                  <FormLabel>Ratio Area Misc</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ratio Area Misc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
