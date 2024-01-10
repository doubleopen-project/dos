// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
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
import DeletePathExclusion from "@/components/delete_item/DeletePathExclusion";
import EditButton from "@/components/edit_item/EditButton";
import ExclusionFormDialog from "@/components/path_exclusions/ExclusionFormDialog";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type Props = {
    purl: string;
    fractionalWidth: number;
};

const ExclusionDB = ({ purl, fractionalWidth = 0.75 }: Props) => {
    const [open, setOpen] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [listWidth, setListWidth] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const pathPurl = toPathPurl(purl);
    const { data, isLoading, error } = userHooks.useGetPathExclusionsByPurl(
        { withCredentials: true, params: { purl: pathPurl } },
        { enabled: !!pathPurl },
    );

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            setListWidth(width * fractionalWidth);
        }
    }, [buttonRef.current?.offsetWidth, fractionalWidth]); // Re-run effect if the button's size changes

    // Get user from useUser hook, to decide what DB rights the user has for curations
    let user = undefined;
    user = useUser();
    const userName = user ? user.username : "Guest";
    const userRole = user ? user.role : "";

    return (
        <>
            {isLoading && (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                </div>
            )}
            {error && <div>{error.message}</div>}
            {data && (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={buttonRef}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="h-fit w-full justify-between"
                        >
                            <div className="text-xs">
                                List/delete path exclusions
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="p-0"
                        style={{ width: listWidth }}
                    >
                        <Command>
                            <CommandInput placeholder="Search for path exclusion..." />
                            <CommandEmpty>
                                No path exclusions found.
                            </CommandEmpty>
                            <CommandGroup className="max-h-[70vh] min-h-[1px] overflow-y-auto">
                                {data.pathExclusions.map((exclusion) => (
                                    <div
                                        key={`wrapper-${exclusion.id}`}
                                        className="flex items-stretch justify-between"
                                        data-testid="path-exclusion"
                                    >
                                        <CommandItem
                                            key={exclusion.id}
                                            className="flex-1 items-start text-left"
                                        >
                                            <div className="flex w-full flex-col text-xs">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="mr-1">
                                                        {
                                                            new Date(
                                                                exclusion.updatedAt,
                                                            )
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                    </span>
                                                    <span className="rounded-sm bg-orange-400 p-1 font-bold">
                                                        {
                                                            exclusion.user
                                                                .username
                                                        }
                                                    </span>
                                                </div>
                                                <div className="mb-1 rounded-sm bg-slate-500 p-1 font-bold">
                                                    {exclusion.pattern}
                                                </div>
                                                <span className="text-smaller">
                                                    <span className="mr-1">
                                                        Reason:
                                                    </span>
                                                    <span>
                                                        {exclusion.reason}
                                                    </span>
                                                </span>
                                                <span className="text-smaller italic">
                                                    {exclusion.comment}
                                                </span>
                                            </div>
                                        </CommandItem>
                                        <CommandItem
                                            key={`delete-${exclusion.id}`}
                                        >
                                            {(userName ===
                                                exclusion.user.username ||
                                                userRole === "ADMIN") && (
                                                <div className="flex align-middle">
                                                    <EditButton
                                                        name="edit"
                                                        className="mr-1 px-2"
                                                        onClick={() =>
                                                            setOpenEditDialog(
                                                                true,
                                                            )
                                                        }
                                                    />
                                                    <DeletePathExclusion
                                                        data={exclusion}
                                                    />
                                                </div>
                                            )}
                                        </CommandItem>
                                        <ExclusionFormDialog
                                            purl={purl}
                                            mode="Edit"
                                            id={exclusion.id}
                                            pattern={exclusion.pattern}
                                            reason={exclusion.reason}
                                            comment={exclusion.comment || ""}
                                            open={openEditDialog}
                                            setOpen={setOpenEditDialog}
                                        />
                                    </div>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </>
    );
};

export default ExclusionDB;
