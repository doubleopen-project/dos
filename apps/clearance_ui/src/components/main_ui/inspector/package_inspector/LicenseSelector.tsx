// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import { parseAsBoolean, useQueryState } from "nuqs";
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

type LicenseSelectorProps = {
    data: Map<string, string>;
    filterString: string;
    className?: string;
};

const LicenseSelector = ({
    data,
    filterString,
    className,
}: LicenseSelectorProps) => {
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
    const licenses: { value: string; label: string; bgcolor: string }[] = [];

    data.forEach((value, key) => {
        licenses.push({ value: key.toLowerCase(), label: key, bgcolor: value });
    });

    // If the license filter is set, set "filtering" to true.
    // Do it as a side effect to avoid infinite loop
    useEffect(() => {
        if (value) {
            setFiltering(true);
        }
    }, [value]);

    return (
        <div className={cn("flex w-full flex-row justify-between", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="h-fit w-5/6 justify-between"
                    >
                        <span className="truncate text-xs">
                            {router.isReady
                                ? value
                                    ? licenses.find(
                                          (license) => license.value === value,
                                      )?.label
                                    : "Select license for filtering..."
                                : null}
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
                                    {license.label.includes("AND") ||
                                    license.label.includes("OR") ? (
                                        <span className="w-11/12 text-xs text-red-600">
                                            {license.label}
                                        </span>
                                    ) : (
                                        <span className="w-11/12 text-xs">
                                            {license.label}
                                        </span>
                                    )}
                                    <span
                                        className="ml-2 mt-1 flex h-2 w-2 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: license.bgcolor,
                                        }}
                                    ></span>
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
                                "mx-2 h-fit text-gray-400",
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

export default LicenseSelector;
