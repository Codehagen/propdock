"use client"

import { useEffect, useState } from "react"
import { createAnalysis } from "@/actions/create-analyse"
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
})

export function AddAnalysisSheet() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(AnalysisSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof AnalysisSchema>) => {
    setIsLoading(true)

    try {
      const result = await createAnalysis(data)

      if (!result.success) {
        throw new Error(result.error || "Kunne ikke lagre analysen.")
      }

      toast.success(`Analyse ble lagret.`)
      form.reset()
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
