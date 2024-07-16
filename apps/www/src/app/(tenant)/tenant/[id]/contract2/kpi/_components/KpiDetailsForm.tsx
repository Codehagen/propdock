"use client"

import { useState } from "react"
import { updateContract } from "@/actions/update-contract" // Import the update function
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, parseISO } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import { Calendar } from "@dingify/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dingify/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dingify/ui/components/select"

import { cn } from "@/lib/utils"

// Define validation schema
const IndexationSchema = z.object({
  indexationType: z.enum(["MARKET", "CPI", "MANUAL"]),
  indexValue: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Index Value must be a number",
    })
    .transform((val) => parseFloat(val)),
  indexationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Indexation Date is required",
  }),
})

export function KpiDetailsForm({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(IndexationSchema),
    defaultValues: {
      indexationType: tenantDetails.contracts[0]?.indexationType || "MARKET",
      indexValue: tenantDetails.contracts[0]?.indexValue?.toString() || "",
      indexationDate: tenantDetails.contracts[0]?.indexationDate
        ? tenantDetails.contracts[0]?.indexationDate.toISOString().split("T")[0]
        : "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    const parsedData = {
      ...data,
      indexValue: parseFloat(data.indexValue.toString()),
      indexationDate: new Date(data.indexationDate),
    }

    try {
      const result = await updateContract(
        tenantDetails.contracts[0].id,
        parsedData,
      )

      if (!result.success) {
        throw new Error(
          result.error || "Kunne ikke oppdatere indeksinformasjonen.",
        )
      }

      toast.success("Indeksinformasjon oppdatert")
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indeksdetaljer</CardTitle>
        <CardDescription>
          Oppdater indeksdetaljer for leietakeren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="indexationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indekstype</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg indekstype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MARKET">Marked</SelectItem>
                      <SelectItem value="CPI">KPI</SelectItem>
                      <SelectItem value="MANUAL">Manuell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="indexValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indeksverdi (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Indeksverdi..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="indexationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Indeksasjonsdato</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(parseISO(field.value), "PPP")
                          ) : (
                            <span>Velg en dato</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? parseISO(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : "",
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
