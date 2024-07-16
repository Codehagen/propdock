import { SendIcon } from "lucide-react"

import { Badge } from "@dingify/ui/components/badge"
import { Button } from "@dingify/ui/components/button"
import { Input } from "@dingify/ui/components/input"
import { Label } from "@dingify/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dingify/ui/components/select"
import { Separator } from "@dingify/ui/components/separator"
import { Textarea } from "@dingify/ui/components/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@dingify/ui/components/tooltip"

import { PlusIcon } from "../shared/icons"

export default function TenantSendInvoice() {
  return (
    <div className="grid">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Lag faktura</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* <Button variant="outline" size="sm" className="h-8 gap-1">
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Download</span>
            </Button> */}
            <Button variant="outline" size="sm" className="h-8 gap-1">
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
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Kunde
                </legend>
                <div className="grid gap-3">
                  <Label>Kunde</Label>
                  <Select>
                    <SelectTrigger className="items-start [&_[data-description]]:hidden">
                      <SelectValue placeholder="Velg en kunde" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genesis">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          {/* <RabbitIcon className="size-5" /> */}
                          <div className="grid gap-0.5">
                            <p>Proaktiv Eiendomsmegling </p>
                            <p className="text-xs" data-description>
                              Our fastest model for general use cases.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="explorer">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          {/* <BirdIcon className="size-5" /> */}
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Explorer
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Performance and speed for efficiency.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="quantum">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          {/* <TurtleIcon className="size-5" /> */}
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Quantum
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              The most powerful model for complex computations.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label>Epost</Label>
                  <Input type="string" placeholder="Epost til kunden..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label>Vår referanse</Label>
                    <Input
                      type="string"
                      placeholder="Referanse (Ikke påkrevd)"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label>Deres referanse</Label>
                    <Input
                      type="string"
                      placeholder="Referanse (Ikke påkrevd)"
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label>Ordrereferanse</Label>
                  <Input type="string" placeholder="Referanse (Ikke påkrevd)" />
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Produkter
                </legend>
                <div className="grid gap-3">
                  <Label>Produkter</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Velg product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Produkt 1</SelectItem>
                      <SelectItem value="product2">Produkt 2</SelectItem>
                      <SelectItem value="product3">Produkt 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label>Antall</Label>
                  <Input type="number" placeholder="1" />
                </div>
                <div className="grid gap-3">
                  <Label>Pris</Label>
                  <Input type="number" placeholder="0,00" />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Faktura
                </legend>
                <div className="grid gap-3">
                  <Label>Faktura</Label>
                  <Input type="string" placeholder="Epost til kunden..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label>Dato</Label>
                    <Input type="string" placeholder="Dagens dato" />
                  </div>
                  <div className="grid gap-3">
                    <Label>Forfall</Label>
                    <Input type="string" placeholder="14 dager" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label>Kontonummer</Label>
                  <Input type="string" placeholder="1234 56 78903" />
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">Pris</legend>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span>Sum</span>
                    <span>99,99 NOK</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mva</span>
                    <span>79,99 NOK</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rabatt</span>
                    <span>0%</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span>Sum</span>
                    <span>99,99 (179.99 inkl.mva)</span>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Label>Kommentar</Label>
                  <Textarea placeholder="Kommentar for faktura" />
                </div>
              </fieldset>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
