"use client";

import { assignTenantToOfficeSpace } from "@/actions/create-tenant-to-office-space";
import { getTenantsComboBox } from "@/actions/get-tenants-combo-box";
import { Button } from "@propdock/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@propdock/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@propdock/ui/components/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface Tenant {
  id: number;
  name: string;
  orgnr: number | null;
  numEmployees: number;
  building: { name: string };
  floor: { number: number } | null;
  officeSpace: { name: string } | null;
}

export function SeeTenantsComboBox({ officeSpaceId, workspaceId }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<number | null>(null);
  const [tenants, setTenants] = React.useState<Tenant[]>([]);

  React.useEffect(() => {
    async function fetchTenants() {
      const response = await getTenantsComboBox(workspaceId);
      if (response.success) {
        setTenants(response.tenants || []); // Ensure tenants is always an array
      } else {
        toast.error("Failed to fetch tenants.");
      }
    }
    fetchTenants();
  }, [workspaceId]);

  const handleSelect = async (tenantId: number) => {
    try {
      const result = await assignTenantToOfficeSpace(officeSpaceId, tenantId);
      if (result.success) {
        toast.success("Tenant assigned successfully.");
        setValue(tenantId); // Set the selected tenant value
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || "Failed to assign tenant.");
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value !== null
            ? tenants.find((tenant) => tenant.id === value)?.name
            : "Select tenant..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tenant..." className="h-9" />
          <CommandList>
            <CommandEmpty>No tenant found.</CommandEmpty>
            <CommandGroup>
              {tenants.map((tenant) => (
                <CommandItem
                  key={tenant.id}
                  value={tenant.id.toString()}
                  onSelect={() => handleSelect(tenant.id)}
                >
                  {tenant.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === tenant.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
