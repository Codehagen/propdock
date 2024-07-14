"use client"

import { useState } from "react"
import { updateAnalysis } from "@/actions/update-analysis"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import { Calendar } from "@dingify/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dingify/ui/components/card"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dingify/ui/components/popover"

import { cn } from "@/lib/utils"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  appreciationDate: z.date({
    required_error: "Appreciation date is required.",
  }),
})

interface EditAnalysisNameCardProps {
  analysisId: number
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
        toast.success("Analysis updated successfully.")
      } else {
        throw new Error(result.error || "Failed to update analysis.")
      }
    } catch (error) {
      toast.error(error.message)
      console.error("Error updating analysis:", error)
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Analysis Name" {...field} />
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
                  <FormLabel>Appreciation Date</FormLabel>
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
