"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, differenceInCalendarDays, format } from "date-fns"
import { nb } from "date-fns/locale"
import { CalendarIcon, PlusIcon, SendIcon } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@dingify/ui/components/button"
import { Calendar } from "@dingify/ui/components/calendar"
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dingify/ui/components/select"
import { Separator } from "@dingify/ui/components/separator"
import { Textarea } from "@dingify/ui/components/textarea"

import { cn } from "@/lib/utils"

const InvoiceSchema = z.object({
  customer: z.string().min(1, "Kunde er påkrevd"),
  email: z.string().email("Ugyldig epostadresse").min(1, "Epost er påkrevd"),
  ourReference: z.string().optional(),
  theirReference: z.string().optional(),
  orderReference: z.string().optional(),
  product: z.string().min(1, "Produkt er påkrevd"),
  quantity: z.number().min(1, "Antall må være minst 1"),
  price: z.number().min(0, "Pris må være minst 0"),
  invoiceEmail: z
    .string()
    .email("Ugyldig epostadresse")
    .min(1, "Epost er påkrevd"),
  date: z.date({ required_error: "Dato er påkrevd" }),
  dueDate: z.date({ required_error: "Forfallsdato er påkrevd" }),
  accountNumber: z.string().min(1, "Kontonummer er påkrevd"),
  comment: z.string().optional(),
})

export default function TenantSendInvoice({ customers, products }) {
  const today = new Date()
  const fourteenDaysFromToday = addDays(today, 14)

  const form = useForm({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      customer: "",
      email: "",
      ourReference: "",
      theirReference: "",
      orderReference: "",
      product: "",
      quantity: 1,
      price: 0,
      invoiceEmail: "",
      date: today,
      dueDate: fourteenDaysFromToday,
      accountNumber: "",
      comment: "",
    },
  })

  const quantity = useWatch({ control: form.control, name: "quantity" })
  const price = useWatch({ control: form.control, name: "price" })
  const date = useWatch({ control: form.control, name: "date" })
  const dueDate = useWatch({ control: form.control, name: "dueDate" })

  const totalPrice = quantity * price
  const vat = totalPrice * 0.25
  const totalPriceWithVat = totalPrice + vat

  const daysBetween =
    date && dueDate ? differenceInCalendarDays(dueDate, date) : 0

  const onSubmit = async (data) => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = true
        if (isSuccess) {
          resolve({ name: "Invoice" })
        } else {
          reject("Error creating invoice")
        }
      }, 2000)
    })

    toast.promise(promise, {
      loading: "Vennligst vent...",
      success: (data) => {
        return `Faktura er blitt sendt`
      },
      error: "Error",
    })

    promise
      .then(() => {
        console.log(data)
        form.reset()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className="grid">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Lag faktura</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={form.handleSubmit(onSubmit)}
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Send</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Ny</span>
            </Button>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative flex flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full items-start gap-6"
              >
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Kunde
                  </legend>
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kunde</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="items-start [&_[data-description]]:hidden">
                              <SelectValue placeholder="Velg en kunde" />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map((customer) => (
                                <SelectItem
                                  key={customer.id}
                                  value={customer.id}
                                >
                                  <div className="flex items-start gap-3 text-muted-foreground">
                                    <div className="grid gap-0.5">
                                      <p>{customer.name}</p>
                                      <p className="text-xs" data-description>
                                        {customer.orgnr}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Epost</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Epost til kunden..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ourReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vår referanse</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Referanse (Ikke påkrevd)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="theirReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deres referanse</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Referanse (Ikke påkrevd)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="orderReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordrereferanse</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Referanse (Ikke påkrevd)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Produkter
                  </legend>
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produkter</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              const selectedProduct = products.find(
                                (product) => product.id === value,
                              )
                              if (selectedProduct) {
                                form.setValue("price", selectedProduct.price)
                              }
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Velg produkt" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Antall</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pris</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0,00"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
              </form>
            </Form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full items-start gap-6"
              >
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Faktura
                  </legend>
                  <FormField
                    control={form.control}
                    name="invoiceEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faktura</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Epost til kunden..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Dato</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                                locale={nb}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            Forfall
                            {date && dueDate && (
                              <span className="ml-2 text-muted-foreground">
                                ({daysBetween} dager)
                              </span>
                            )}
                          </FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                                locale={nb}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontonummer</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="1234 56 78903"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Pris
                  </legend>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span>Sum</span>
                      <span>{totalPrice.toFixed(2)} NOK</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mva</span>
                      <span>{vat.toFixed(2)} NOK</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rabatt</span>
                      <span>0%</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span>Sum</span>
                      <span>{totalPriceWithVat.toFixed(2)} NOK (inkl.mva)</span>
                    </div>
                  </div>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kommentar</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Kommentar for faktura"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  )
}
