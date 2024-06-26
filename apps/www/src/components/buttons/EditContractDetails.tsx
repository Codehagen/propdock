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

// Define the validation schema
const ContractSchema = z.object({
  contractType: z.enum(["LEASE", "SUBLEASE", "INTERNAL"]),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start Date is required",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End Date is required",
  }),
  negotiationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Negotiation Date is required",
  }),
  baseRent: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Base Rent must be a positive number",
    })
    .transform((val) => parseFloat(val)),
  indexationType: z.enum(["MARKET", "CPI", "MANUAL"]),
  indexValue: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val === "" || !isNaN(parseFloat(val)), {
      message: "Index Value must be a number",
    })
    .transform((val) => (val === null || val === "" ? null : parseFloat(val))),
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

  const form = useForm({
    resolver: zodResolver(ContractSchema),
    defaultValues: {
      ...initialValues,
      startDate: initialValues.startDate.toISOString().split("T")[0],
      endDate: initialValues.endDate.toISOString().split("T")[0],
      negotiationDate: initialValues.negotiationDate
        .toISOString()
        .split("T")[0],
      baseRent: initialValues.baseRent.toString(),
      indexValue: initialValues.indexValue?.toString() || "",
    },
  })

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
        throw new Error(result.error || "Failed to update contract.")
      }

      toast.success(`Contract updated successfully.`)
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
          <SheetTitle>Edit Contract</SheetTitle>
          <SheetDescription>
            Update the details of the contract.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LEASE">LEASE</SelectItem>
                      <SelectItem value="SUBLEASE">SUBLEASE</SelectItem>
                      <SelectItem value="INTERNAL">INTERNAL</SelectItem>
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
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-[240px] pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value ? (
                            format(parseISO(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseISO(field.value)}
                        onSelect={(date) =>
                          field.onChange(date.toISOString().split("T")[0])
                        }
                        initialFocus
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
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-[240px] pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value ? (
                            format(parseISO(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseISO(field.value)}
                        onSelect={(date) =>
                          field.onChange(date.toISOString().split("T")[0])
                        }
                        initialFocus
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
                <FormItem className="flex flex-col">
                  <FormLabel>Negotiation Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-[240px] pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value ? (
                            format(parseISO(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseISO(field.value)}
                        onSelect={(date) =>
                          field.onChange(date.toISOString().split("T")[0])
                        }
                        initialFocus
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
                  <FormLabel>Base Rent</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Base Rent..."
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <FormLabel>Indexation Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select indexation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MARKET">MARKET</SelectItem>
                      <SelectItem value="CPI">CPI</SelectItem>
                      <SelectItem value="MANUAL">MANUAL</SelectItem>
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
                  <FormLabel>Index Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Index Value..."
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
                {isLoading ? "Updating..." : "Update Contract"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
