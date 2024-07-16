"use client"

import { useEffect, useState } from "react"
import { createAnalysis } from "@/actions/create-analyse"
import { getBuildings } from "@/actions/get-buildings" // Import this function
import { getProperties } from "@/actions/get-properties"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dingify/ui/components/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@dingify/ui/components/sheet"

const AnalysisSchema = z.object({
  name: z.string().min(1, "Name is required"),
  propertyId: z.string().min(1, "Property is required"),
  buildingId: z.string().min(1, "Building is required"),
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
        console.error("Failed to fetch properties:", error)
      }
    }
    fetchProperties()
  }, [])

  const onPropertyChange = async (propertyId: string) => {
    form.setValue("propertyId", propertyId)
    try {
      const buildings = await getBuildings(propertyId)
      setBuildings(buildings)
      form.setValue("buildingId", "") // Reset building selection when property changes
    } catch (error) {
      console.error("Failed to fetch buildings:", error)
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
        throw new Error(result.error || "Failed to save analysis.")
      }

      toast.success(`Analysis for property was saved.`)
      form.reset()
      // Optionally, refresh the page or update the state to show the new analysis
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name..." {...field} />
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
                  <FormLabel>Property</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      onPropertyChange(value)
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property" />
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
                  <FormLabel>Building</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    disabled={!buildings.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a building" />
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
                {isLoading ? "Saving..." : "Lag ny analyse"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
