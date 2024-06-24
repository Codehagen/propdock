"use client"

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@dingify/ui/components/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@dingify/ui/components/collapsible";
import { AddOfficeSpaceSheet } from "@/components/buttons/AddOfficeSpaceSheet";
import { ChevronDown, PlusCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@dingify/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@dingify/ui/components/dropdown-menu";
import { EditOfficeSpaceSheet } from "@/components/buttons/EditOfficeSpaceSheet";

export default function FloorsTable({ floors }) {
  const handleKontraktClick = () => {
    console.log("Kontrakt clicked");
  };

  return (
    <div className="w-full sm:p-4">
      <div className="rounded-md sm:border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Etasje</TableHead>
              <TableHead className="font-medium">Total kvm</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {floors ? (
              floors.map((floor) => (
                <Collapsible key={floor.id} asChild>
                  <>
                    <TableRow>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center space-x-1 cursor-pointer">
                            <span>{floor.number}</span>
                            <ChevronDown className="chevron h-4 w-4 text-muted-foreground transition-transform duration-200" />
                          </div>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell>{floor.maxTotalKvm} KVM</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                              <PlusCircle className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Opprett
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Lag ny</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleKontraktClick}>
                              Kontrakt
                            </DropdownMenuItem>
                            <DropdownMenuItem>Faktura</DropdownMenuItem>
                            <DropdownMenuItem>Endre leietaker</DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <AddOfficeSpaceSheet floorId={floor.id} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <div className="w-full">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-medium">Navn</TableHead>
                              <TableHead className="font-medium">Størrelse</TableHead>
                              <TableHead className="font-medium">Løpetid</TableHead>
                              <TableHead className="font-medium">Kontaktperson</TableHead>
                              <TableHead className="font-medium">Utleid</TableHead>
                              <TableHead className="font-medium">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {floor.officeSpaces && floor.officeSpaces.length > 0 ? (
                              floor.officeSpaces.map((office) => (
                                <TableRow key={office.id}>
                                  <TableCell>{office.name}</TableCell>
                                  <TableCell>{office.sizeKvm} KVM</TableCell>
                                  <TableCell>{office.leaseDuration || 'N/A'}</TableCell>
                                  <TableCell>{office.contactPerson || 'N/A'}</TableCell>
                                  <TableCell>{office.isRented ? 'Ja' : 'Nei'}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Åpne meny</span>
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Valg</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                          <EditOfficeSpaceSheet
                                            officeId={office.id}
                                            currentName={office.name}
                                            currentSizeKvm={office.sizeKvm}
                                            currentIsRented={office.isRented}
                                          />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => navigator.clipboard.writeText(office.name)}
                                        >
                                          Kopier navn
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>View customer</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                          Delete
                                          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6}>Legg til kontorer</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
