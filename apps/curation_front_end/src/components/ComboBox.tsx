// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect, useRef } from "react";
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
import { parseAsString, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";

type ComboBoxProps = {
    data: Set<string>;
    filterString: string;
    selectText?: string;
};

const ComboBox = ({ data, filterString, selectText }: ComboBoxProps) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [listWidth, setListWidth] = useState(0); // State to hold the calculated list width
    const [value, setValue] = useQueryState(
        filterString,
        parseAsString.withDefault(""),
    );
    const router = useRouter();

    // Map data to the format required by the Command component
    const dataAsArray = Array.from(data).map((d) => ({
        value: d.toLowerCase(),
        label: d,
    }));

    useEffect(() => {
        // Step 2: Read button's width and set list width
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            const fraction = 0.75; // Replace with the fraction you desire
            setListWidth(width * fraction);
        }
    }, [buttonRef.current]); // Re-run effect if the button's size changes

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-fit justify-between"
                >
                    <span className="text-xs">
                        {router.isReady
                            ? value
                                ? dataAsArray.find((d) => d.value === value)
                                      ?.label
                                : selectText
                                ? selectText
                                : "Select..."
                            : null}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: listWidth }}>
                <Command>
                    <CommandInput placeholder="Search license..." />
                    <CommandEmpty>No license found.</CommandEmpty>
                    <CommandGroup className="max-h-[80vh] min-h-[1px] w-full overflow-y-auto">
                        {dataAsArray.map((d, index) => (
                            <CommandItem
                                key={`${d.value}-${index}`} // Combining value with index
                                className="items-start text-left"
                                onSelect={(currentValue) => {
                                    setValue(
                                        currentValue === value
                                            ? null
                                            : currentValue,
                                    );
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === d.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                <span className="text-xs">{d.label}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ComboBox;
