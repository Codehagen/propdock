"use client"

import { useEffect, useState } from "react"
import { createFloor } from "@/actions/create-floor"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import { Card, CardContent } from "@propdock/ui/components/card"
import { Checkbox } from "@propdock/ui/components/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@propdock/ui/components/form"
import { Input } from "@propdock/ui/components/input"
import { Label } from "@propdock/ui/components/label"
import { Separator } from "@propdock/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@propdock/ui/components/sheet"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { PlusIcon } from "../shared/icons"

// Define the validation schema
const FloorSchema = z.object({
  totalKvm: z.number().min(1, "Total KVM is required"),
  floors: z.number().min(1, "Number of floors is required"),
  splitKvm: z.boolean(),
})

export function AddFloorSheet({ buildingId }) {
  const [isLoading, setIsLoading] = useState(false)
  const [floorDistribution, setFloorDistribution] = useState("")

  const form = useForm({
    resolver: zodResolver(FloorSchema),
    defaultValues: {
      totalKvm: undefined,
      floors: undefined,
      splitKvm: false,
    },
  })

  const totalKvm = form.watch("totalKvm")
  const floors = form.watch("floors")
  const splitKvm = form.watch("splitKvm")

  useEffect(() => {
    if (totalKvm && floors) {
      if (splitKvm) {
        const kvmPerFloor = (totalKvm / floors).toFixed(2)
        setFloorDistribution(`${floors} etasjer med ${kvmPerFloor} KVM hver.`)
      } else {
        setFloorDistribution(`1 etasje med ${totalKvm} KVM.`)
      }
    } else {
      setFloorDistribution("")
    }
  }, [totalKvm, floors, splitKvm])

  const onSubmit = async (data) => {
    setIsLoading(true)

    const { totalKvm, floors, splitKvm } = data
    const maxTotalKvm = splitKvm ? totalKvm / floors : totalKvm

    try {
      if (splitKvm) {
        for (let i = 1; i <= floors; i++) {
          const floorData = {
            number: i,
            maxTotalKvm,
            maxOfficeKvm: 0, // Assuming default value, replace with actual value if needed
            maxCommonKvm: 0, // Assuming default value, replace with actual value if needed
          }
          const result = await createFloor(buildingId, floorData)

          if (!result.success) {
            throw new Error(result.error || "Failed to save floor.")
          }
        }
      } else {
        const floorData = {
          number: floors,
          maxTotalKvm,
          maxOfficeKvm: 0, // Assuming default value, replace with actual value if needed
          maxCommonKvm: 0, // Assuming default value, replace with actual value if needed
        }
        const result = await createFloor(buildingId, floorData)

        if (!result.success) {
          throw new Error(result.error || "Failed to save floor.")
        }
      }

      toast.success(`Det er lagt til ${floors} etasjer.`)
      form.reset()
      // Optionally, refresh the page or update the state to show the new floor
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
        <Button variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          Legg til ny etasje
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny etasje</SheetTitle>
          <SheetDescription>
            Fyll ut detaljene for å legge til en ny etasje eller flere etasjer.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="totalKvm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total KVM</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000 kvm..."
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
                name="floors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antall etasjer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3..."
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
                name="splitKvm"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Del inn etasjene</FormLabel>
                      <FormDescription>
                        Fordel total KVM likt mellom etasjene.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {floorDistribution && (
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Fordeling: {floorDistribution}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <SheetFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  "Lag ny etasje"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
