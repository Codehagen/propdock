"use client"

import { useState } from "react"
import { addIncomeUnits } from "@/actions/update-analysis"
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
import { Label } from "@dingify/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dingify/ui/components/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@dingify/ui/components/table"
import { Textarea } from "@dingify/ui/components/textarea"

const FormSchema = z.object({
  numberOfUnits: z.number().min(1, "Number of units must be at least 1"),
  description: z.string().min(1, "Description is required"),
  areaPerUnit: z.number().min(0, "Area must be a positive number"),
  valuePerUnit: z.number().min(0, "Value must be a positive number"),
})

interface IncomeUnit {
  id: string
  typeDescription: string
  areaPerUnit: number
  valuePerUnit: number
  numberOfUnits: number
}

interface EditIncomeCardProps {
  analysisId: number
  initialAnnualRent: number
  initialOtherIncome: number
  incomeUnits: IncomeUnit[]
}

export function EditIncomeCard({
  analysisId,
  initialAnnualRent,
  initialOtherIncome,
  incomeUnits,
}: EditIncomeCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numberOfUnits: 1,
      description: "",
      areaPerUnit: 0,
      valuePerUnit: 0,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await addIncomeUnits(analysisId, {
        typeDescription: data.description,
        areaPerUnit: data.areaPerUnit,
        valuePerUnit: data.valuePerUnit,
        numberOfUnits: data.numberOfUnits,
      })

      if (result.success) {
        toast.success(`${result.count} inntektsenheter ble lagt til.`)
        form.reset() // Reset the form after successful submission
      } else {
        throw new Error(result.error || "Kunne ikke legge til inntektsenheter.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Feil ved tillegging av inntektsenheter:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Inntektsenheter</CardTitle>
            <CardDescription>Overall income overview</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Legg til enheter</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium leading-none">
                  Legg til ny inntektsenhet
                </h3>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numberOfUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antall enheter</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Skriv inn antall enheter"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beskrivelse</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Skriv inn beskrivelse"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="areaPerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areal per enhet (kvm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Skriv inn areal per enhet"
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
                      name="valuePerUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verdi per enhet (kr)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Skriv inn verdi per enhet"
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Totalt areal (kvm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={(
                            form.watch("numberOfUnits") *
                              form.watch("areaPerUnit") || 0
                          ).toFixed(2)}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Total verdi (kr)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={(
                            form.watch("numberOfUnits") *
                              form.watch("valuePerUnit") || 0
                          ).toFixed(2)}
                          disabled
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => form.reset()}>
                      Avbryt
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      Lagre {form.watch("numberOfUnits")} stk
                    </Button>
                  </div>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Antall</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>kvm</TableHead>
                <TableHead>kr</TableHead>
                <TableHead>kr / kvm</TableHead>
                <TableHead>Totalt kvm</TableHead>
                <TableHead>Totalt kr</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeUnits.map((unit) => {
                const totalArea = unit.numberOfUnits * unit.areaPerUnit
                const totalValue = unit.numberOfUnits * unit.valuePerUnit
                return (
                  <TableRow key={unit.id}>
                    <TableCell>{unit.numberOfUnits}</TableCell>
                    <TableCell>{unit.typeDescription}</TableCell>
                    <TableCell>{unit.areaPerUnit.toFixed(2)}</TableCell>
                    <TableCell>{unit.valuePerUnit.toLocaleString()}</TableCell>
                    <TableCell>
                      {(unit.valuePerUnit / unit.areaPerUnit).toFixed(2)}
                    </TableCell>
                    <TableCell>{totalArea.toFixed(2)}</TableCell>
                    <TableCell>{totalValue.toLocaleString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableRow>
              <TableCell colSpan={4}>Totalt:</TableCell>
              <TableCell>
                {(
                  incomeUnits.reduce(
                    (sum, unit) => sum + unit.numberOfUnits * unit.valuePerUnit,
                    0,
                  ) /
                  incomeUnits.reduce(
                    (sum, unit) => sum + unit.numberOfUnits * unit.areaPerUnit,
                    0,
                  )
                ).toFixed(2)}
              </TableCell>
              <TableCell>
                {incomeUnits
                  .reduce(
                    (sum, unit) => sum + unit.numberOfUnits * unit.areaPerUnit,
                    0,
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell>
                {incomeUnits
                  .reduce(
                    (sum, unit) => sum + unit.numberOfUnits * unit.valuePerUnit,
                    0,
                  )
                  .toLocaleString()}
              </TableCell>
            </TableRow>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
