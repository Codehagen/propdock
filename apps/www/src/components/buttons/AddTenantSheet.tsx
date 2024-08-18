"use client"

import { useEffect, useState } from "react"
import { createTenant } from "@/actions/create-tenant"
import { getBuildings } from "@/actions/get-buildings"
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

const TenantSchema = z.object({
  name: z.string().min(1, "Navn er påkrevd"),
  orgnr: z
    .string()
    .length(9, "Organisasjonsnummer må være 9 siffer")
    .regex(/^\d{9}$/, "Organisasjonsnummer må være 9 siffer"),
  numEmployees: z.number().min(1, "Antall ansatte er påkrevd"),
  propertyId: z.string().optional(),
  buildingId: z.string().optional(),
})

interface Property {
  id: string
  name: string
}

interface Building {
  id: string
  name: string
}

export function AddTenantSheet() {
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      name: "",
      orgnr: "",
      numEmployees: 1,
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
    } catch (error) {
      console.error("Failed to fetch buildings:", error)
    }
  }

  const onSubmit = async (data: z.infer<typeof TenantSchema>) => {
    setIsLoading(true)

    try {
      const tenantData = {
        ...data,
        orgnr: parseInt(data.orgnr, 10),
        numEmployees: Number(data.numEmployees),
      }

      const result = await createTenant(tenantData)

      if (!result.success) {
        throw new Error(result.error || "Kunne ikke lagre leietaker.")
      }

      toast.success(`Leietaker ${data.name} ble lagret.`)
      form.reset()
      setIsOpen(false) // Close the sheet on success
      // Optionally, refresh the page or update the state to show the new tenant
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Legg til ny leietaker
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny leietaker</SheetTitle>
          <SheetDescription>
            Legg til detaljer for den nye leietakeren.
          </SheetDescription>
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
              name="orgnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisasjonsnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="Organisasjonsnummer..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antall ansatte</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Antall ansatte..."
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
                        <SelectItem
                          key={property.id}
                          value={property.id.toString()}
                        >
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
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
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
                        <SelectItem
                          key={building.id}
                          value={building.id.toString()}
                        >
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
                {isLoading ? "Lagrer..." : "Lagre ny leietaker"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
