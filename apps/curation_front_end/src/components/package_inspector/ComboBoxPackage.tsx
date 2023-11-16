// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { parseAsString, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import React, { useState } from "react";

type ComboBoxPackageProps = {
    data: Set<string>;
    filterString: string;
};

const ComboBoxPackage = ({ data, filterString }: ComboBoxPackageProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useQueryState(
        filterString,
        parseAsString.withDefault(""),
    );
    const router = useRouter();

    // Map data to the format required by the Command component
    const licenses = Array.from(data).map((license) => ({
        value: license.toLowerCase(),
        label: license,
    }));

    return (
        <div className="flex flex-row justify-between w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between w-5/6 h-fit"
                    >
                        <span className="text-xs truncate">
                            {router.isReady
                                ? value
                                    ? licenses.find(
                                          (license) => license.value === value,
                                      )?.label
                                    : "Select license..."
                                : null}
                        </span>
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
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
                                            "mr-2 h-4 w-1/12",
                                            value === license.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    <span className="text-xs w-11/12">
                                        {license.label}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <Button
                variant="destructive"
                className="h-fit w-1/6"
                onClick={() => setValue(null)}
            >
                <X className="w-4 h-4 shrink-0" />
            </Button>
        </div>
    );
};

export default ComboBoxPackage;
