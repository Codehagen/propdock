"use client"

import { useEffect, useState } from "react"
import { updateContract } from "@/actions/update-contract" // Import the update function
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Switch } from "@propdock/ui/components/switch"
import { addYears, format, parseISO } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Define validation schema
const TermsSchema = z.object({
  baseRent: z
    .string()
    .refine((val) => !isNaN(parseFloat(val.replace(/\s/g, ""))), {
      message: "Base Rent must be a positive number",
    })
    .transform((val) => parseFloat(val.replace(/\s/g, ""))),
  isMonthly: z.boolean().default(false).optional(),
  isRenewable: z.boolean().default(false).optional(),
  renewablePeriod: z.string().optional().nullable(),
})

export function TermsDetailsForm({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMonthly, setIsMonthly] = useState(
    tenantDetails.contracts[0]?.isMonthly || false,
  )
  const [isRenewable, setIsRenewable] = useState(
    tenantDetails.contracts[0]?.isRenewable || false,
  )

  const form = useForm({
    resolver: zodResolver(TermsSchema),
    defaultValues: {
      baseRent: tenantDetails.contracts[0]?.baseRent
        ? tenantDetails.contracts[0]?.baseRent
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        : "",
      isMonthly: tenantDetails.contracts[0]?.isMonthly || false,
      isRenewable: tenantDetails.contracts[0]?.isRenewable || false,
      renewablePeriod: tenantDetails.contracts[0]?.renewablePeriod
        ? tenantDetails.contracts[0]?.renewablePeriod.toString()
        : "",
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

    const baseRent = isMonthly
      ? parseFloat(data.baseRent.toString().replace(/\s/g, "")) * 12
      : parseFloat(data.baseRent.toString().replace(/\s/g, ""))

    const parsedData = {
      baseRent,
      isRenewable: data.isRenewable,
      renewablePeriod: isRenewable
        ? addYears(new Date(), parseInt(data.renewablePeriod))
        : null,
    }

    try {
      const result = await updateContract(
        tenantDetails.contracts[0].id,
        parsedData,
      )

      if (!result.success) {
        throw new Error(result.error || "Kunne ikke oppdatere kontrakten.")
      }

      toast.success("Kontrakten oppdatert")
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate yearly rent based on monthly input if applicable
  const calculatedYearlyRent = isMonthly
    ? parseFloat(form.watch("baseRent").replace(/\s/g, "")) * 12
    : parseFloat(form.watch("baseRent").replace(/\s/g, ""))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leievilkår</CardTitle>
        <CardDescription>
          Oppdater leievilkårene for leietakeren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
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
              name="isMonthly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Er dette en månedlig leie?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                        setIsMonthly(value)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {isMonthly && (
              <FormItem>
                <FormLabel>Årlig Leieinntekter</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Årlig Leieinntekter"
                    value={formatBaseRent(calculatedYearlyRent.toString())}
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
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
