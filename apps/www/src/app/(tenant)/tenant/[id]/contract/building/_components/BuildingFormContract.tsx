"use client"

import { useEffect, useState } from "react"
import { createContract } from "@/actions/create-contract"
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

// Define the validation schema
const ContractSchema = z.object({
  building: z.string().min(1, "Bygning er påkrevd"),
  property: z.string().min(1, "Eiendom er påkrevd"),
  floor: z.string().min(1, "Etasje er påkrevd"),
  officeSpace: z.string().min(1, "Kontorlokale er påkrevd"),
  contactId: z.string().min(1, "Kontaktperson er påkrevd"),
})

export function BuildingFormContract({ tenantDetails }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState(
    tenantDetails?.floor?.id?.toString() || "",
  )

  const form = useForm({
    resolver: zodResolver(ContractSchema),
    defaultValues: {
      building: tenantDetails?.building?.id?.toString() || "",
      property: tenantDetails?.property?.id?.toString() || "",
      floor: tenantDetails?.floor?.id?.toString() || "",
      officeSpace: tenantDetails?.officeSpace?.id?.toString() || "",
      contactId: tenantDetails?.contacts[0]?.id?.toString() || "",
    },
  })

  useEffect(() => {
    if (tenantDetails?.floor?.id) {
      setSelectedFloor(tenantDetails.floor.id.toString())
      form.setValue("floor", tenantDetails.floor.id.toString())
    }
    if (tenantDetails?.officeSpace?.id) {
      form.setValue("officeSpace", tenantDetails.officeSpace.id.toString())
    }
  }, [tenantDetails, form])

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const result = await createContract({
        ...data,
        tenantId: tenantDetails.id,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to submit issue.")
      }

      toast.success("Informasjonen er nå lagret")
      form.reset()
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get office spaces for the selected floor
  const officeSpaces = selectedFloor
    ? tenantDetails.floors.find(
        (floor) => floor.id.toString() === selectedFloor,
      )?.officeSpaces || []
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lokaler</CardTitle>
        <CardDescription>Hvordan lokale skal leies ut?</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eiendom</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={tenantDetails.property.id.toString()}
                          >
                            {tenantDetails.property.name}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Byggning</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select building" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={tenantDetails.building.id.toString()}
                          >
                            {tenantDetails.building.name}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etasje</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedFloor(value)
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Velg Etasje" />
                        </SelectTrigger>
                        <SelectContent>
                          {tenantDetails.floors.length > 0 ? (
                            tenantDetails.floors.map((floor) => (
                              <SelectItem
                                key={floor.id}
                                value={floor.id.toString()}
                              >
                                {`Etasje ${floor.number}`}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="no-floors">
                              Du må legge til etasjer
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeSpace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kontorlokale</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Velg kontor" />
                        </SelectTrigger>
                        <SelectContent>
                          {officeSpaces.length > 0 ? (
                            officeSpaces.map((officeSpace) => (
                              <SelectItem
                                key={officeSpace.id}
                                value={officeSpace.id.toString()}
                              >
                                {officeSpace.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="no-office-spaces">
                              Du har ingen kontorlokale til etasjen
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
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
