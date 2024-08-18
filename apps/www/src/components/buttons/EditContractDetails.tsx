"use client"

import { useState } from "react"
import { updateContractDetails } from "@/actions/update-contract-details"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, parseISO } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import { Calendar } from "@dingify/ui/components/calendar"
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@dingify/ui/components/sheet"

import { cn } from "@/lib/utils"
import { nb } from "date-fns/locale"

// Define the validation schema
const ContractSchema = z.object({
  contractType: z.enum(["LEASE", "SUBLEASE", "INTERNAL"]),
  startDate: z.date({required_error: "Startdato påkrevd"}),
  endDate: z.date({required_error: "Sluttdato påkrevd"}),
  negotiationDate: z.date({required_error: "Forhandlingsdato påkrevd"}),
  baseRent: z
    .string()
    .refine((val) => !isNaN(parseFloat(val.replace(/\s/g, ""))), {
      message: "Leieinntekter må være et positivt tall",
    })
    .transform((val) => parseFloat(val.replace(/\s/g, ""))),
  indexationType: z.enum(["MARKET", "CPI", "MANUAL"]),
  indexValue: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => val === null || val === "" || !isNaN(parseFloat(val || "0")),
      {
        message: "KPI verdi må være et tall",
      },
    )
    .transform((val) =>
      val === null || val === "" ? null : parseFloat(val || "0"),
    ),
})

export function EditContractSheet({
  contractId,
  initialValues,
  currentPath,
  children,
  tenantId,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Convert dates to ISO strings if they are Date objects
  const formatDateString = (date) =>
    date instanceof Date ? date : date

  const form = useForm({
    resolver: zodResolver(ContractSchema),
    defaultValues: {
      contractType: initialValues.contractType || undefined,
      startDate: initialValues.startDate || undefined,
      endDate: initialValues.endDate || undefined,
      negotiationDate:
        initialValues.negotiationDate || undefined,
      baseRent: initialValues.baseRent?.toString() || undefined,
      indexationType: initialValues.indexationType || undefined,
      indexValue: initialValues.indexValue?.toString() || undefined,
    },
  })

  const formatBaseRent = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const handleBaseRentChange = (e) => {
    const { value } = e.target
    const formattedValue = formatBaseRent(value.replace(/\s/g, ""))
    form.setValue("baseRent", formattedValue)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)

    const parsedData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      negotiationDate: new Date(data.negotiationDate),
      tenantId,
    }

    try {
      const result = await updateContractDetails(
        contractId,
        parsedData,
        currentPath,
      )

      if (!result.success) {
        throw new Error(result.error || "Kunne ikke oppdatere kontrakten.")
      }

      toast.success(`Kontrakten ble oppdatert.`)
      form.reset()
      setIsOpen(false) // Close the sheet on success
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Økonomi</SheetTitle>
          <SheetDescription>Endre vilkårene for leietakeren.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontraktstype</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg kontraktstype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LEASE">Leie</SelectItem>
                      <SelectItem value="SUBLEASE">Fremleie</SelectItem>
                      <SelectItem value="INTERNAL">Internleie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startdato</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: nb })
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
                        locale={nb}
                        selected={
                          field.value ? field.value : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(
                            date ? date : "",
                          )
                        }
                          
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sluttdato</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {locale: nb})
                          ) : (
                            <span>Velg en dato</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                      locale={nb}
                        mode="single"
                        selected={
                          field.value ? field.value : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date ? date : "",
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="negotiationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forhandlingsdato</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", {locale: nb})
                          ) : (
                            <span>Velg en dato</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                      locale={nb}
                        mode="single"
                        selected={
                          field.value ? field.value : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date ? date : "",
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leieinntekter</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Leieinntekter..."
                      {...field}
                      value={field.value}
                      onChange={handleBaseRentChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="indexationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KPI regulering</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg reguleringstype" />
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
                  <FormLabel>KPI verdi (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="KPI verdi..."
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Lagrer..." : "Oppdater"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
