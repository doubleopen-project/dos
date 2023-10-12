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
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;
type LicenseConclusions = DataType["licenseConclusions"][0];

type ComboBoxCurationsProps = {
    data?: LicenseConclusions[];
    filterString: string;
    selectText?: string;
    fractionalWidth?: number;
};

const ComboBoxCurations = ({
    data,
    filterString,
    selectText,
    fractionalWidth = 0.75,
}: ComboBoxCurationsProps) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [listWidth, setListWidth] = useState(0);
    const [value, setValue] = useQueryState(
        filterString,
        parseAsString.withDefault(""),
    );
    const router = useRouter();

    // Clean up the URL when component unmounted
    useEffect(() => {
        return () => {
            setValue(null);
        };
    }, []);

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            setListWidth(width * fractionalWidth);
        }
    }, [buttonRef.current?.offsetWidth]); // Re-run effect if the button's size changes

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
                                ? data?.find(
                                      (d) =>
                                          d.concludedLicenseExpressionSPDX ===
                                          value,
                                  )?.concludedLicenseExpressionSPDX
                                : selectText
                            : null}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: listWidth }}>
                <Command>
                    <CommandInput placeholder="Search curation..." />
                    <CommandEmpty>No curations found.</CommandEmpty>
                    <CommandGroup className="max-h-[80vh] min-h-[1px] w-full overflow-y-auto">
                        {data?.map((d) => (
                            <CommandItem
                                key={d.id}
                                className="items-start text-left"
                                onSelect={() => {
                                    console.log(
                                        "OnSelect concludedLicenseExpressionSPDX:",
                                        d.concludedLicenseExpressionSPDX,
                                    );
                                    setValue(
                                        d.concludedLicenseExpressionSPDX ===
                                            value
                                            ? null
                                            : d.concludedLicenseExpressionSPDX,
                                    );
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value ===
                                            d.concludedLicenseExpressionSPDX
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                <span className="text-xs">
                                    {d.concludedLicenseExpressionSPDX}
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ComboBoxCurations;
