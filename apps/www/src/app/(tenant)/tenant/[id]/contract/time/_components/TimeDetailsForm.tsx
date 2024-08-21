"use client"

import { useEffect, useState } from "react"
import { updateContract } from "@/actions/update-contract" // Import the update function
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addYears, format, parseISO } from "date-fns"
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
import { Switch } from "@dingify/ui/components/switch"

import { cn } from "@/lib/utils"

// Define validation schema
const TimeSchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start Date is required",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End Date is required",
  }),
  isRenewable: z.boolean().optional(),
  renewablePeriod: z.string().optional().nullable(),
  isContinuousRent: z.boolean(),
})

export function TimeDetailsForm({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(TimeSchema),
    defaultValues: {
      startDate: tenantDetails.contracts[0]?.startDate
        ? new Date(tenantDetails.contracts[0]?.startDate)
            .toISOString()
            .split("T")[0]
        : "",
      endDate: tenantDetails.contracts[0]?.endDate
        ? new Date(tenantDetails.contracts[0]?.endDate)
            .toISOString()
            .split("T")[0]
        : "",
      isRenewable: tenantDetails.contracts[0]?.isRenewable || false,
      renewablePeriod: tenantDetails.contracts[0]?.renewablePeriod
        ? tenantDetails.contracts[0]?.renewablePeriod.toString()
        : "",
      isContinuousRent: tenantDetails.contracts[0]?.isContinuousRent || false,
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const endDate = new Date(data.endDate)
      const renewablePeriod = data.isRenewable
        ? addYears(endDate, parseInt(data.renewablePeriod))
        : null

      const result = await updateContract(tenantDetails.contracts[0].id, {
        startDate: new Date(data.startDate),
        endDate,
        isRenewable: data.isRenewable,
        renewablePeriod,
        isContinuousRent: data.isContinuousRent,
      })

      if (!result.success) {
        throw new Error(
          result.error || "Kunne ikke oppdatere tidsinformasjonen.",
        )
      }

      toast.success("Tidsinformasjon oppdatert")
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
        <CardTitle>Tidsrom</CardTitle>
        <CardDescription>
          Vis og oppdater tidsrom for leietakeren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
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
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
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
            </div>
            <FormField
              control={form.control}
              name="isRenewable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Kan forlenges?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("isRenewable") && (
              <FormField
                control={form.control}
                name="renewablePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forlengelsesperiode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Velg forlengelsesperiode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 år</SelectItem>
                        <SelectItem value="2">2 år</SelectItem>
                        <SelectItem value="3">3 år</SelectItem>
                        <SelectItem value="4">4 år</SelectItem>
                        <SelectItem value="5">5 år</SelectItem>
                        <SelectItem value="6">6 år</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="isContinuousRent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Løpende leie</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
