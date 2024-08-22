"use client"

import { useEffect, useRef, useState } from "react"
import { createBuilding } from "@/actions/create-building"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@propdock/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@propdock/ui/components/dropdown-menu"
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
import fetchProperties from "src/lib/address-search"
import { z } from "zod"

// Define the validation schema
const BuildingSchema = z.object({
  name: z.string().min(1, "Building Name is required"),
  address: z.string().optional(),
  gnr: z.coerce.string(),
  bnr: z.coerce.string(),
  snr: z.coerce.string(),
  fnr: z.coerce.string(),
})

export function AddBuildingSheet({ propertyId }) {
  const [address, setAddress] = useState<any>([])
  const [openSearch, setOpenSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(BuildingSchema),
    defaultValues: {
      name: "",
      address: "",
      gnr: "",
      bnr: "",
      snr: "",
      fnr: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    // Convert string inputs to numbers
    const convertedData = {
      ...data,
      gnr: data.gnr ? parseInt(data.gnr, 10) : undefined,
      bnr: data.bnr ? parseInt(data.bnr, 10) : undefined,
      snr: data.snr ? parseInt(data.snr, 10) : undefined,
      fnr: data.fnr ? parseInt(data.fnr, 10) : undefined,
    }

    try {
      const result = await createBuilding(propertyId, convertedData)

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

  async function handleSearchProperty(address: string) {
    const data = await fetchProperties(address)
    if (!address) {
      setAddress([])
      setOpenSearch(false)
    }
    if (data?.adresser?.length) {
      setAddress(data.adresser)
      setOpenSearch(true)
    }
  }

  function handleEnterKey(event: any, data: any) {
    if (event.key === "Enter") {
      handleSelectAddress(data)
      setOpenSearch(false)
    }
    if (event.key === "Esc") {
      setOpenSearch(false)
    }
  }

  function handleSelectAddress(data: any) {
    // Reset the form if user selects a new address
    const savedName = form.getValues("name")
    form.reset()
    form.setValue("name", savedName)
    if (data) {
      form.setValue("address", data.adressetekst)
      form.setValue("gnr", data.gardsnummer)
      form.setValue("bnr", data.bruksnummer)
      form.setValue("fnr", data.festenummer)
      // form.setValue("snr", data.??)  // There is no property called "snr/seksjonsnummer" - Could it be "bruksenhetsnummer" or "undernummer" (??)
    }
    setOpenSearch(false)
  }

  const ulRef = useRef<HTMLUListElement>(null)

  // Close the dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ulRef.current && !ulRef.current.contains(event.target)) {
        setOpenSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ulRef])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Legg til ny byggning</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Legg til ny bygning</SheetTitle>
          <SheetDescription>
            Legg til byggninger som hører til eiendommen.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn på bygg</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <div className="relative">
                      <Input
                        autoComplete="off"
                        className="searcher"
                        // Close search if user presses "Esc"
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault()
                            event.stopPropagation()
                            setOpenSearch(false)
                          }
                        }}
                        onKeyUp={(e) => {
                          if (e.key === "Escape") return
                          void handleSearchProperty(e.currentTarget.value)
                        }}
                        placeholder="Address..."
                        {...field}
                      />
                      <ul
                        hidden={!openSearch}
                        ref={ulRef}
                        tabIndex={-1}
                        // style={{ scrollbarWidth: "thin" }}
                        className="absolute mt-2 max-h-[300px] w-full overflow-y-auto rounded-sm border bg-white shadow-md dark:bg-primary-foreground"
                        onAbort={() => setOpenSearch(false)}
                      >
                        {address
                          ? address.map((adr) => {
                              return (
                                <li
                                  onKeyDown={(event) => {
                                    // Close search if user presses "Esc"
                                    if (event.key === "Escape") {
                                      event.preventDefault()
                                      event.stopPropagation()
                                      setOpenSearch(false)
                                    }
                                    handleEnterKey(event, adr)
                                  }}
                                  onClick={() => handleSelectAddress(adr)}
                                  tabIndex={0}
                                  key={`${adr.adressetekst} - ${adr.oppateringsdato} - ${adr?.representasjonspunkt?.lat}`}
                                  className="px-2 py-1.5 text-sm outline-none hover:cursor-default hover:bg-accent focus:bg-accent"
                                >
                                  {adr.adressetekst} - {adr.postnummer}{" "}
                                  {adr.poststed}
                                </li>
                              )
                            })
                          : null}
                      </ul>
                    </div>
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
            <SheetFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Saving..." : "Lagre ny bygning"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
