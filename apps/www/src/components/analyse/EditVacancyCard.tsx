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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dingify/ui/components/select"

const FormSchema = z.object({
  year: z.string().min(1, "Year is required"),
  value: z.string().min(1, "Value is required"),
})

interface EditVacancyCardProps {
  analysisId: number
  initialVacancyPerYear: string // JSON string of vacancy per year
}

export function EditVacancyCard({
  analysisId,
  initialVacancyPerYear,
}: EditVacancyCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [vacancyData, setVacancyData] = useState(
    JSON.parse(initialVacancyPerYear),
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      year: "",
      value: "",
    },
  })

  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() + i).toString(),
  )

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const updatedVacancyData = { ...vacancyData, [data.year]: data.value }
      const result = await updateAnalysis(analysisId, {
        vacancyPerYear: JSON.stringify(updatedVacancyData),
      })
      if (result.success) {
        toast.success("Analysis updated successfully.")
        setVacancyData(updatedVacancyData)
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
        <CardTitle>Vacancy Per Year</CardTitle>
        <CardDescription>Edit vacancy per year values.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Value" {...field} />
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
        <div className="mt-4 space-y-2">
          {Object.entries(vacancyData).map(([year, value]) => (
            <div key={year} className="flex justify-between">
              <span>{year}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
