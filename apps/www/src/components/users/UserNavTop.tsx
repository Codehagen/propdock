"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createSmsTenant } from "@/actions/create-sms-tenant"
import { ChevronDown, File, MessageSquare, PlusCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@dingify/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dingify/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dingify/ui/components/dropdown-menu"
import { Input } from "@dingify/ui/components/input"
import { Label } from "@dingify/ui/components/label"
import { Textarea } from "@dingify/ui/components/textarea"

export function UserNavTop({ tenantDetails }) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [contactName, setContactName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleKontraktClick = () => {
    router.push(`/tenant/${tenantDetails.id}/contract/`)
  }

  const handleSMSClick = () => {
    if (tenantDetails.contacts && tenantDetails.contacts.length > 0) {
      const contact = tenantDetails.contacts[0]
      setContactName(contact.name || "")
      setPhone(contact.phone || "Ingen telefonnummer registrert")
    } else {
      setContactName("Ingen kontaktperson registrert")
      setPhone("Ingen telefonnummer registrert")
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await createSmsTenant(tenantDetails.id, message)
      if (result.success) {
        toast.success("SMS sent successfully")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(error.message || "Failed to send SMS")
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center pb-2">
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={handleSMSClick}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            SMS
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Opprett
              </span>
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Lag ny</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleKontraktClick}>
              Kontrakt
            </DropdownMenuItem>
            <DropdownMenuItem>Endre leietaker</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogDescription>
              Skriv inn meldingen du vil sende til leietakeren.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactName" className="sr-only">
                Kontaktperson
              </Label>
              <Input
                id="contactName"
                placeholder="Kontaktperson"
                value={contactName}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="sr-only">
                Telefonnummer
              </Label>
              <Input
                id="phone"
                placeholder="Telefonnummer"
                value={phone}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="sr-only">
                Melding
              </Label>
              <Textarea
                id="message"
                placeholder="Skriv inn meldingen din her..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || phone === "Ingen telefonnummer registrert"}
            >
              {isLoading ? "Sender..." : "Send SMS"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Avbryt
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
