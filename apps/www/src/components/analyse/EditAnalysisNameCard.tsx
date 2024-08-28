"use client"

import { useState } from "react"
import { updateAnalysis } from "@/actions/update-analysis"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import { Calendar } from "@propdock/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@propdock/ui/components/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { nb } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { cn } from "@/lib/utils"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Navnet må være minst 2 tegn.",
  }),
  appreciationDate: z.date({
    required_error: "Verdivurderingsdato er påkrevd.",
  }),
})

interface EditAnalysisNameCardProps {
  analysisId: string
  initialName: string
  initialDate: Date
}

export function EditAnalysisNameCard({
  analysisId,
  initialName,
  initialDate,
}: EditAnalysisNameCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialName,
      appreciationDate: initialDate,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true)
    try {
      const result = await updateAnalysis(analysisId, {
        name: data.name,
        appreciationDate: data.appreciationDate,
      })
      if (result.success) {
        toast.success("Analysen ble oppdatert.")
      } else {
        throw new Error(result.error || "Kunne ikke oppdatere analysen.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Feil ved oppdatering av analyse:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navn</CardTitle>
        <CardDescription>Endre navn og dato på analysen.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn</FormLabel>
                  <FormControl>
                    <Input placeholder="Analysenavn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appreciationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Verdivurderingsdato</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: nb })
                          ) : (
                            <span>Velg en dato</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={nb}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : "Lagre"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
