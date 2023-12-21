// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, XCircle } from "lucide-react";
import { parseAsBoolean, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ComboBoxPackageProps = {
    data: Set<string>;
    filterString: string;
    className?: string;
};

const ComboBoxPackage = ({
    data,
    filterString,
    className,
}: ComboBoxPackageProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useQueryState(filterString, {
        parse: (query: string) => query.toLowerCase(),
    });
    const [, setFiltering] = useQueryState(
        "filtering",
        parseAsBoolean.withDefault(false),
    );
    const router = useRouter();

    // Map data to the format required by the Command component
    const licenses = Array.from(data).map((license) => ({
        value: license.toLowerCase(),
        label: license,
    }));

    // If the license filter is set, set "filtering" to true.
    // Do it as a side effect to avoid infinite loop
    useEffect(() => {
        if (value) {
            setFiltering(true);
        }
    }, [value]);

    return (
        <div className={cn("flex flex-row justify-between w-full", className)}>
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
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger
                        className="ml-1"
                        type="button"
                        onClick={() => {
                            setValue(null);
                            setFiltering(null);
                        }}
                        disabled={value === ""}
                    >
                        <XCircle
                            className={cn(
                                "mx-2 text-gray-400 h-fit",
                                !value ? "opacity-40" : "opacity-100",
                            )}
                        />
                    </TooltipTrigger>
                    <TooltipContent>Remove license filtering</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default ComboBoxPackage;
