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
import DeleteLicenseConclusion from "@/components/delete_item/DeleteLicenseConclusion";
import { cn } from "@/lib/utils";

type DataType = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/packages/:purl/files/:sha256/license-conclusions/"
>;

type Props = {
    data?: DataType;
    concludedLicenseExpressionSPDX: string | undefined;
    setConcludedLicenseExpressionSPDX: (newSPDX: string | null) => void;
    fractionalWidth?: number;
};

const ConclusionDB = ({
    data,
    concludedLicenseExpressionSPDX,
    setConcludedLicenseExpressionSPDX,
    fractionalWidth = 0.75,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(concludedLicenseExpressionSPDX);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [listWidth, setListWidth] = useState(0);
    const minWidth = 375;
    const router = useRouter();

    // Get user from useUser hook, to decide what DB rights the user has for conclusions
    let user = undefined;
    user = useUser();
    const userName = user ? user.username : "Guest";
    const userRole = user ? user.role : "";

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            if (width * fractionalWidth >= minWidth)
                setListWidth(width * fractionalWidth);
            else setListWidth(minWidth);
        }
    }, [buttonRef.current?.offsetWidth, fractionalWidth]); // Re-run effect if the button's size changes

    // Update parent state when a conclusion is selected
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
                        data-testid="conclusion-db-button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="h-fit w-full justify-between"
                    >
                        <div className="text-xs">
                            {router.isReady
                                ? value
                                    ? data?.licenseConclusions.find(
                                          (d) => d.id === parseInt(value, 10),
                                      )?.concludedLicenseExpressionSPDX
                                    : "Select existing license conclusion from DB..."
                                : null}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" style={{ width: listWidth }}>
                    <Command>
                        <CommandInput placeholder="Search license conclusion..." />
                        <CommandEmpty>
                            No license conclusions found.
                        </CommandEmpty>
                        <CommandGroup className="max-h-[50vh] min-h-[1px] overflow-y-auto">
                            {data?.licenseConclusions.map((d) => (
                                <div
                                    key={`wrapper-${d.id}`}
                                    className="flex items-start justify-between"
                                >
                                    <CommandItem
                                        key={d.id}
                                        className="flex-1 items-start text-left"
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
                                        <div className="ml-2 flex w-full flex-col text-xs">
                                            <span className="mb-2 flex justify-between">
                                                <span>
                                                    <span className="mr-1">
                                                        Concluded:
                                                    </span>
                                                    <span
                                                        data-testid="concluded-license"
                                                        className="rounded-sm bg-green-400 p-1 font-bold"
                                                    >
                                                        {
                                                            d.concludedLicenseExpressionSPDX
                                                        }
                                                    </span>
                                                    {d.bulkConclusionId && (
                                                        <span
                                                            data-testid="license-type"
                                                            className="ml-1 rounded-sm bg-blue-400 p-1 font-bold"
                                                        >
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
                                                    <span className="rounded-sm bg-orange-400 p-1 font-bold">
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
                                            <span className="text-smaller italic">
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
                                            <DeleteLicenseConclusion data={d} />
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
                                "mx-2 h-fit text-gray-400",
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

export default ConclusionDB;
