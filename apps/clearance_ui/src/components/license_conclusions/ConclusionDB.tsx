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
import EditButton from "@/components/edit_item/EditButton";
import BulkConclusionFormDialog from "@/components/license_conclusions/BulkConclusionFormDialog";
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
    const [openEditDialog, setOpenEditDialog] = useState(false);
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
                                    className="flex items-stretch justify-between"
                                    data-testid="license-conclusion"
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
                                            {/* Date and creator */}
                                            <div className="mb-1 flex items-center justify-between">
                                                <span>
                                                    {
                                                        new Date(d.updatedAt)
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                </span>
                                                <span className="rounded-sm bg-orange-400 p-1 font-bold">
                                                    {d.user.username}
                                                </span>
                                            </div>

                                            {/* Clearance info */}
                                            <div className="mb-1">
                                                <span className="mr-1 font-bold">
                                                    Concluded:
                                                </span>
                                                <span className="rounded-sm bg-green-400 p-0.5 font-bold">
                                                    {
                                                        d.concludedLicenseExpressionSPDX
                                                    }
                                                </span>
                                                {d.bulkConclusionId && (
                                                    <span
                                                        data-testid="license-type"
                                                        className="ml-1 rounded-sm bg-blue-400 p-0.5 font-bold"
                                                    >
                                                        BULK
                                                    </span>
                                                )}
                                                {d.local && (
                                                    <span
                                                        data-testid="license-type"
                                                        className="ml-1 rounded-sm bg-red-400 p-0.5 font-bold"
                                                    >
                                                        LOCAL
                                                    </span>
                                                )}
                                            </div>

                                            {/* Detected license */}
                                            <div className="text-smaller mb-1">
                                                <span className="mr-1 font-bold">
                                                    Detected:
                                                </span>
                                                <span>
                                                    {
                                                        d.detectedLicenseExpressionSPDX
                                                    }
                                                </span>
                                            </div>

                                            {/* Context PURL */}
                                            <div className="text-smaller mb-1">
                                                <span className="mr-1 font-bold">
                                                    Context PURL:
                                                </span>
                                                {d.contextPurl}
                                            </div>

                                            {/* Comment */}
                                            <div className="text-smaller mb-1 italic">
                                                {d.comment}
                                            </div>
                                        </div>
                                    </CommandItem>
                                    <CommandItem key={`delete-${d.id}`}>
                                        {(userName === d.user.username ||
                                            userRole === "ADMIN") && (
                                            <div className="flex align-middle">
                                                {d.bulkConclusionId && (
                                                    <EditButton
                                                        name="edit"
                                                        className="mr-1 px-2"
                                                        onClick={() =>
                                                            setOpenEditDialog(
                                                                true,
                                                            )
                                                        }
                                                    />
                                                )}
                                                <DeleteLicenseConclusion
                                                    data={d}
                                                />
                                            </div>
                                        )}
                                    </CommandItem>
                                    <BulkConclusionFormDialog
                                        purl={d.contextPurl}
                                        open={openEditDialog}
                                        setOpen={setOpenEditDialog}
                                    />
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
