"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProperty } from "@/actions/create-property"
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

// Define the validation schema
const PropertySchema = z.object({
  name: z.string().min(1, "Eiendomsnavn er påkrevd"),
  type: z.string().min(1, "Eiendomstype er påkrevd"),
  countryCode: z.string().min(2, "Landkode er påkrevd").max(2),
})

export function AddPropertyButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      name: "",
      type: "",
      countryCode: "NO",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const result = await createProperty(
        data.name,
        data.type,
        data.countryCode,
      )

      if (!result.success) {
        throw new Error(result.error || "Feil ved oppretting av eiendom.")
      }

      toast.success(`Eiendommen "${data.name}" ble lagt til.`)
      form.reset()
      router.push(`/property/${result.property?.id}`)
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
        <Button variant="default">Legg til eiendom</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til eiendom</SheetTitle>
          <SheetDescription>
            Skriv inn informasjon om den nye eiendommen
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn på eiendom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hva kaller du eiendommen..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eiendomstype</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg eiendomstype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Bolig</SelectItem>
                      <SelectItem value="commercial">Næringseiendom</SelectItem>
                      <SelectItem value="industrial">Industri</SelectItem>
                      <SelectItem value="land">Tomt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg land" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NO">Norge</SelectItem>
                      <SelectItem value="SE">Sverige</SelectItem>
                      <SelectItem value="DK">Danmark</SelectItem>
                      <SelectItem value="FI">Finland</SelectItem>
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
                {isLoading ? "Lagrer..." : "Lagre ny eiendom"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
