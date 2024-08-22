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
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Define validation schema
const LandlordSchema = z.object({
  landlordOrgnr: z.string().min(1, "Organisasjonsnummer er påkrevd"),
  landlordName: z.string().min(1, "Navn er påkrevd"),
})

export function LandlordDetailsForm({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(LandlordSchema),
    defaultValues: {
      landlordOrgnr:
        tenantDetails.contracts[0]?.landlordOrgnr?.toString() || "",
      landlordName: tenantDetails.contracts[0]?.landlordName || "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const result = await updateContract(tenantDetails.contracts[0].id, {
        landlordOrgnr: parseInt(data.landlordOrgnr),
        landlordName: data.landlordName,
      })

      if (!result.success) {
        throw new Error(
          result.error || "Kunne ikke oppdatere kontaktinformasjonen.",
        )
      }

      toast.success("Kontaktinformasjon oppdatert")
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
        <CardTitle>Utleierdetaljer</CardTitle>
        <CardDescription>
          Vis og oppdater kontaktinformasjon for utleieren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="landlordName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input placeholder="Propdock AS..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landlordOrgnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisasjonsnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="Organisasjonsnummer" {...field} />
                  </FormControl>
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
