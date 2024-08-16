"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { customerTableSchema } from "@/app/api/citadel/customers/types"
import { dealsTableSchema } from "@/app/api/citadel/deals/types"
import {
  deleteDeal,
  mapDealStageToStep,
  patchDeal,
} from "@/app/api/citadel/deals/utils"
import { CRM_User } from "@/app/api/citadel/users/types"

import DeleteDeal from "./DeleteDeal"
import EditDeal from "./EditDeal"

interface DataTableRowActionsProps<TData> {
  row: any
}

export function DataTableRowActionsDeal<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const deal = dealsTableSchema.parse(row.original)

  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  //* Delegate deal
  const [openDelegate, setOpenDelegate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<CRM_User | null>(null)
  const [fetchedUsers, setFetchedUsers] = useState<CRM_User[]>(
    deal.list_of_users
  )

  async function handleSelectStage(stage: any) {
    await patchDeal(row.original.uuid, { stage: stage })
    router.refresh()
  }

  return (
    <div>
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={(open) => setDropdownOpen(open)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Åpne meny</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setOpenDelegate(true)}>
            Delegér deal
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:text-accent-foreground">
              Endre stage
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleSelectStage("Lead")}>
                Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelectStage("Pratet med kunde")}
              >
                Pratet med kunde
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelectStage("Sendt tilbud")}
              >
                Sendt tilbud
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelectStage("Følge opp")}>
                Følge opp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelectStage("Forhandling")}
              >
                Forhandling
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelectStage("Tapt")}>
                Tapt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelectStage("Vunnet")}>
                Vunnet
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <div>
            <EditDeal data={row.original} />
          </div>
          <div>
            <DeleteDeal data={row.original} />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openDelegate} onOpenChange={setOpenDelegate}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>Send deal</DialogTitle>
            <DialogDescription>Send dealen til noen andre.</DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
            <CommandInput placeholder="Søk etter bruker..." />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Laster inn brukere...</CommandEmpty>
              ) : fetchedUsers.length === 0 ? (
                <CommandEmpty>Fant ingen brukere.</CommandEmpty>
              ) : (
                <CommandGroup className="p-2">
                  {fetchedUsers.map((user) => (
                    <CommandItem
                      key={user.email}
                      className="flex items-center px-2"
                      onSelect={() => setSelectedUser(user)}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt="Image" />
                        <AvatarFallback>NN</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium leading-none">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {selectedUser === user ? (
                        <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUser ? (
              <div className="flex -space-x-2 overflow-hidden">
                <Avatar
                  key={selectedUser.email}
                  className="inline-block border-2 border-background"
                >
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>NN</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Velg en bruker</p>
            )}
            <Button
              disabled={!selectedUser}
              onClick={() => {
                //console.log("Trying to use callback with ", selectedUser);
                const change_user_id =
                  selectedUser?.id || "Dette skal ikke skje"

                const changes = {
                  user: change_user_id,
                }
                const result = deal.handler(deal.uuid, changes)

                if (result) {
                  toast({
                    title: "Oppgaven ble sendt!",
                    description: `Mottaker: ${selectedUser?.email}`,
                  })
                  router.refresh()
                } else {
                  toast({
                    title: "Au!",
                    description: "Dette gikk ikke bra, vi undersøker.",
                    variant: "destructive",
                  })
                }

                setOpenDelegate(false)
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
