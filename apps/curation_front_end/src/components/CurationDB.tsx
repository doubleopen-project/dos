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
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import { useRouter } from "next/router";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type Props = {
    data?: DataType;
    concludedLicenseExpressionSPDX: string;
    setConcludedLicenseExpressionSPDX: (newSPDX: string | null) => void;
    fractionalWidth?: number;
};

const CurationDB = ({
    data,
    concludedLicenseExpressionSPDX,
    setConcludedLicenseExpressionSPDX,
    fractionalWidth = 0.75,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(concludedLicenseExpressionSPDX);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [listWidth, setListWidth] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            setListWidth(width * fractionalWidth);
        }
    }, [buttonRef.current?.offsetWidth]); // Re-run effect if the button's size changes

    // Update parent state when a curation is selected
    const handleSelect = (d: {
        id: number;
        concludedLicenseExpressionSPDX: string;
    }) => {
        setValue(d.id === parseInt(value || "", 10) ? "" : d.id.toString());
        setConcludedLicenseExpressionSPDX(d.concludedLicenseExpressionSPDX); // Update parent state
        setOpen(false);
    };

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
                    <div className="text-xs">
                        {router.isReady
                            ? value
                                ? data?.licenseConclusions.find(
                                      (d) => d.id === parseInt(value, 10),
                                  )?.concludedLicenseExpressionSPDX
                                : "Select curation from DB..."
                            : null}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: listWidth }}>
                <Command>
                    <CommandInput placeholder="Search curation..." />
                    <CommandEmpty>No curations found.</CommandEmpty>
                    <CommandGroup className="max-h-[70vh] min-h-[1px] overflow-y-auto">
                        {data?.licenseConclusions.map((d) => (
                            <CommandItem
                                key={d.id}
                                className="items-start text-left"
                                onSelect={() => handleSelect(d)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === d.id.toString()
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                <div className="text-xs flex flex-col w-full border-r-slate-700 ml-2">
                                    <span className="flex justify-between mb-2">
                                        <span>
                                            <span className="mr-1">
                                                Curated:
                                            </span>
                                            <span className="font-bold bg-green-200 p-1 rounded-sm">
                                                {
                                                    d.concludedLicenseExpressionSPDX
                                                }
                                            </span>
                                        </span>
                                        <span className="">
                                            <span className="mr-1">
                                                {
                                                    new Date(d.updatedAt)
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                            </span>
                                            <span className="font-bold bg-orange-200 p-1 rounded-sm">
                                                {d.user.username}
                                            </span>
                                        </span>
                                    </span>
                                    <span className="text-smaller">
                                        <span className="mr-1">Detected:</span>
                                        <span>
                                            {d.detectedLicenseExpressionSPDX}
                                        </span>
                                    </span>
                                    <span className="text-smaller">
                                        <span className="mr-1">
                                            Context PURL:
                                        </span>
                                        {d.contextPurl}
                                    </span>
                                    <span className="text-smaller italic">
                                        {d.comment}
                                    </span>
                                </div>
                                <div className="p-0 ml-2">
                                    <Button key={d.id} className="px-2">
                                        <Delete></Delete>
                                    </Button>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CurationDB;
