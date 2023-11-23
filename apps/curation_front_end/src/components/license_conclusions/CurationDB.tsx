// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef, useState } from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import { Check, ChevronsUpDown, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import { userAPI } from "validation-helpers";
import { useUser } from "@/hooks/useUser";
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
import QueryDeleteButton from "@/components/QueryDeleteButton";
import { cn } from "@/lib/utils";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type Props = {
    data?: DataType;
    concludedLicenseExpressionSPDX: string | undefined;
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

    // Get user from useUser hook, to decide what DB rights the user has for curations
    let user = undefined;
    user = useUser({});
    const userName = user ? user.username : "Guest";
    const userRole = user ? user.role : "";

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            setListWidth(width * fractionalWidth);
        }
    }, [buttonRef.current?.offsetWidth, fractionalWidth]); // Re-run effect if the button's size changes

    // Update parent state when a curation is selected
    const handleSelect = (d: {
        id: number;
        concludedLicenseExpressionSPDX: string;
    }) => {
        if (d.id === parseInt(value || "", 10)) {
            // If the same item is clicked again, reset the state
            setValue("");
            setConcludedLicenseExpressionSPDX("");
        } else {
            // Otherwise, update the state with the selected item
            setValue(d.id.toString());
            setConcludedLicenseExpressionSPDX(d.concludedLicenseExpressionSPDX);
        }
        setOpen(false);
    };

    return (
        <div className="flex">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={buttonRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between w-full h-fit"
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
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" style={{ width: listWidth }}>
                    <Command>
                        <CommandInput placeholder="Search curation..." />
                        <CommandEmpty>No curations found.</CommandEmpty>
                        <CommandGroup className="max-h-[70vh] min-h-[1px] overflow-y-auto">
                            {data?.licenseConclusions.map((d) => (
                                <div
                                    key={`wrapper-${d.id}`}
                                    className="flex items-start justify-between"
                                >
                                    <CommandItem
                                        key={d.id}
                                        className="items-start flex-1 text-left"
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
                                        <div className="flex flex-col w-full ml-2 text-xs">
                                            <span className="flex justify-between mb-2">
                                                <span>
                                                    <span className="mr-1">
                                                        Curated:
                                                    </span>
                                                    <span className="p-1 font-bold bg-green-400 rounded-sm">
                                                        {
                                                            d.concludedLicenseExpressionSPDX
                                                        }
                                                    </span>
                                                    {d.bulkCurationId && (
                                                        <span className="ml-1 p-1 font-bold bg-blue-400 rounded-sm">
                                                            BULK
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="">
                                                    <span className="mr-1">
                                                        {
                                                            new Date(
                                                                d.updatedAt,
                                                            )
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                    </span>
                                                    <span className="p-1 font-bold bg-orange-400 rounded-sm">
                                                        {d.user.username}
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="text-smaller">
                                                <span className="mr-1">
                                                    Detected:
                                                </span>
                                                <span>
                                                    {
                                                        d.detectedLicenseExpressionSPDX
                                                    }
                                                </span>
                                            </span>
                                            <span className="text-smaller">
                                                <span className="mr-1">
                                                    Context PURL:
                                                </span>
                                                {d.contextPurl}
                                            </span>
                                            <span className="italic text-smaller">
                                                {d.comment}
                                            </span>
                                        </div>
                                    </CommandItem>
                                    <CommandItem
                                        key={`delete-${d.id}`}
                                        className="items-start text-left"
                                    >
                                        {(userName === d.user.username ||
                                            userRole === "ADMIN") && (
                                            <>
                                                <QueryDeleteButton
                                                    id={d.id}
                                                    data={
                                                        d.concludedLicenseExpressionSPDX
                                                    }
                                                    deleteQuery={
                                                        "/license-conclusion/:id"
                                                    }
                                                />
                                            </>
                                        )}
                                    </CommandItem>
                                </div>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger
                        className="ml-1"
                        type="button"
                        onClick={() => {
                            setValue("");
                            setConcludedLicenseExpressionSPDX("");
                        }}
                        disabled={!value || value === ""}
                    >
                        <XCircle
                            className={cn(
                                "mx-2 text-gray-400 h-fit",
                                !value || value.length === 0
                                    ? "opacity-40"
                                    : "opacity-100",
                            )}
                        />
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Clear selection
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default CurationDB;
