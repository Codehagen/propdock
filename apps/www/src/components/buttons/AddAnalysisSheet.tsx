"use client"

import { useEffect, useState } from "react"
import { createAnalysis } from "@/actions/create-analyse"
import { getBuildings } from "@/actions/get-buildings" // Import this function
import { getProperties } from "@/actions/get-properties"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@propdock/ui/components/sheet"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const AnalysisSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  propertyId: z.string().min(1, "Eiendom er påkrevd"),
  buildingId: z.string().min(1, "Bygning er påkrevd"),
})

interface Property {
  id: string
  name: string
}

interface Building {
  id: string
  name: string
}

export function AddAnalysisSheet() {
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])

  const form = useForm({
    resolver: zodResolver(AnalysisSchema),
    defaultValues: {
      name: "",
      propertyId: "",
      buildingId: "",
    },
  })

  useEffect(() => {
    async function fetchProperties() {
      try {
        const properties = await getProperties()
        setProperties(properties)
      } catch (error) {
        console.error("Kunne ikke hente eiendommer:", error)
      }
    }
    fetchProperties()
  }, [])

  const onPropertyChange = async (propertyId: string) => {
    form.setValue("propertyId", propertyId)
    try {
      const buildings = await getBuildings(propertyId)
      setBuildings(buildings)
      form.setValue("buildingId", "") // Tilbakestill bygningsvalg når eiendom endres
    } catch (error) {
      console.error("Kunne ikke hente bygninger:", error)
    }
  }

  const onSubmit = async (data: z.infer<typeof AnalysisSchema>) => {
    setIsLoading(true)

    try {
      const analysisData = {
        ...data,
      }

      const result = await createAnalysis(analysisData)

      if (!result.success) {
        throw new Error(result.error || "Kunne ikke lagre analysen.")
      }

      toast.success(`Analyse for eiendom ble lagret.`)
      form.reset()
      // Eventuelt oppdater siden eller tilstanden for å vise den nye analysen
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Lag ny analyse</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lag en ny analyse</SheetTitle>
          <SheetDescription>Skriv basis informasjon</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input placeholder="Navn..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eiendom</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      onPropertyChange(value)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg en eiendom" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
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
              name="buildingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bygning</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    disabled={!buildings.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg en bygning" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Lagrer..." : "Lag ny analyse"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
