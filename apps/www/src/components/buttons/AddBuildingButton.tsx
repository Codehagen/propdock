"use client"

import { useState } from "react"
import { createBuilding } from "@/actions/create-building"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@propdock/ui/components/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form"
import { Input } from "@propdock/ui/components/input"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

// Define the validation schema
const BuildingSchema = z.object({
  name: z.string().min(1, "Building Name is required"),
  address: z.string().optional(),
  gnr: z.number().optional(),
  bnr: z.number().optional(),
  snr: z.number().optional(),
  fnr: z.number().optional(),
})

export function AddBuildingButton({ propertyId }) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(BuildingSchema),
    defaultValues: {
      name: "",
      address: "",
      gnr: undefined,
      bnr: undefined,
      snr: undefined,
      fnr: undefined,
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const result = await createBuilding(propertyId, data)

      if (!result.success) {
        throw new Error(result.error || "Failed to save building.")
      }

      toast.success(`Byggningen "${data.name}" ble lagret.`)
      form.reset()
      // Optionally, refresh the page or update the state to show the new building
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" disabled={isLoading}>
          Legg til bygning
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Legg til ny bygning</DialogTitle>
          <DialogDescription>
            Legg til byggninger som hører til {propertyId}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Building Name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="GNR..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="BNR..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="snr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="SNR..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fnr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FNR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="FNR..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Saving..." : "Save new building"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
