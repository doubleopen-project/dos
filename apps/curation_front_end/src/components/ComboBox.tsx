// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
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
import { parseAsString, useQueryState } from 'next-usequerystate';

type ComboBoxProps = {
    data: Set<string>;
    filterString: string;
}

const ComboBox = ({ data, filterString }: ComboBoxProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useQueryState(filterString, parseAsString.withDefault(''));

    // Map data to the format required by the Command component
    const licenses = Array.from(data).map((license) => ({
        value: license.toLowerCase(),
        label: license,
    }))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-fit justify-between"
                >
                    <span className="text-xs">
                        {
                            value ? 
                            licenses.find((license) => license.value === value)?.label : 
                            (typeof window !== 'undefined' && "Select license...")
                        }
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search license..." />
                    <CommandEmpty>No license found.</CommandEmpty>
                    <CommandGroup className="max-h-[80vh] min-h-[1px] w-full overflow-y-auto">
                        {licenses.map((license) => (
                            <CommandItem
                                key={license.value}
                                onSelect={(currentValue) => {
                                    console.log("Current value:", currentValue);
                                    setValue(currentValue === value ? null : currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === license.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span className="text-xs">{license.label}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default ComboBox;