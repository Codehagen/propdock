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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@propdock/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@propdock/ui/components/table"
import { Pencil, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
  year: z.string().min(1, "År er påkrevd"),
  value: z.string().min(1, "Verdi er påkrevd"),
})

interface EditVacancyCardProps {
  analysisId: string
  initialVacancyPerYear: string // JSON-streng av ledighet per år
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
        toast.success("Analysen ble oppdatert.")
        setVacancyData(updatedVacancyData)
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

  const sortedVacancyData = Object.entries(vacancyData).sort(([a], [b]) =>
    a.localeCompare(b),
  )

  const handleDelete = async (yearToDelete: string) => {
    setIsLoading(true)
    try {
      const updatedVacancyData = { ...vacancyData }
      delete updatedVacancyData[yearToDelete]
      const result = await updateAnalysis(analysisId, {
        vacancyPerYear: JSON.stringify(updatedVacancyData),
      })
      if (result.success) {
        toast.success("År ble slettet.")
        setVacancyData(updatedVacancyData)
      } else {
        throw new Error(result.error || "Kunne ikke slette år.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Feil ved sletting av år:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ledighet per år</CardTitle>
        <CardDescription>Rediger ledighet per år verdier.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>År</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg et år" />
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
                  <FormLabel>Verdi</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Verdi" {...field} />
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
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>År</TableHead>
                <TableHead>Verdi</TableHead>
                <TableHead className="w-[100px]">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVacancyData.map(([year, value]) => (
                <TableRow key={year}>
                  <TableCell>{year}</TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          form.setValue("year", year)
                          form.setValue("value", value.toString())
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(year)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
