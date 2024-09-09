import * as React from "react"
import { Badge } from "@propdock/ui/components/badge"
import { Button } from "@propdock/ui/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@propdock/ui/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@propdock/ui/components/popover"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

export function MultiSelect({ options, placeholder, values, onValuesChange }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {values.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {values.map((value) => (
                <Badge key={value} variant="secondary">
                  {options.find((option) => option.value === value)?.label}
                </Badge>
              ))}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Søk leietaker..." />
          <CommandEmpty>Ingen leietaker funnet.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  const newValues = values.includes(option.value)
                    ? values.filter((v) => v !== option.value)
                    : [...values, option.value]
                  onValuesChange(newValues)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    values.includes(option.value) ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
