import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LanguageEnum } from "shared-types";
import { Check, ChevronDown } from "lucide-react";

export const LanguageSelect = ({
  value,
  onChange,
}: {
  value: LanguageEnum;
  onChange: (value: LanguageEnum) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between h-8 font-[400] px-3 min-w-[100px]"
          >
            {value
              ? Object.entries(LanguageEnum).find(
                  ([label, language]) => language === value
                )?.[0]
              : "Select language..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[250px] w-full p-0">
          <Command
            filter={(value, search) => {
              if (
                Object.entries(LanguageEnum)
                  .find(([label, language]) => language === value)?.[0]
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
                return 1;
              else return 0;
            }}
          >
            <CommandInput
              placeholder="Search support language..."
              className="h-9"
            />
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup className="max-h-[250px] overflow-auto">
              {Object.entries(LanguageEnum).map(([label, language]) => (
                <CommandItem
                  key={language}
                  value={language}
                  onSelect={(currentValue) => {
                    currentValue && onChange(currentValue as LanguageEnum);
                    setOpen(false);
                  }}
                >
                  {label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === language ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
