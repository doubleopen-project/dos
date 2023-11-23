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
import QueryDeleteButton from "@/components/QueryDeleteButton";

type Props = {
    purl: string | undefined;
    fractionalWidth: number;
};

const ExclusionDB = ({ purl, fractionalWidth = 0.75 }: Props) => {
    const [open, setOpen] = useState(false);
    const [listWidth, setListWidth] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { data, isLoading, error } = userHooks.useImmutableQuery(
        "/path-exclusions",
        { purl: purl as string },
        { withCredentials: true },
        { enabled: !!purl },
    );

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            setListWidth(width * fractionalWidth);
        }
    }, [buttonRef.current?.offsetWidth, fractionalWidth]); // Re-run effect if the button's size changes

    // Get user from useUser hook, to decide what DB rights the user has for curations
    let user = undefined;
    user = useUser({});
    const userName = user ? user.username : "Guest";
    const userRole = user ? user.role : "";

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-16 h-16 mr-2 animate-spin" />
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
                            className="justify-between w-full h-fit"
                        >
                            <div className="text-xs">
                                List/delete path exclusions
                            </div>
                            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
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
                                        className="flex items-start justify-between"
                                    >
                                        <CommandItem
                                            key={exclusion.id}
                                            className="items-start flex-1 text-left"
                                        >
                                            <div className="flex flex-col w-full text-xs">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="mr-1">
                                                        {
                                                            new Date(
                                                                exclusion.updatedAt,
                                                            )
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                    </span>
                                                    <span className="p-1 font-bold bg-orange-400 rounded-sm">
                                                        {
                                                            exclusion.user
                                                                .username
                                                        }
                                                    </span>
                                                </div>
                                                <div className="p-1 font-bold bg-slate-500 rounded-sm mb-1">
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
                                                <span className="italic text-smaller">
                                                    {exclusion.comment}
                                                </span>
                                            </div>
                                        </CommandItem>
                                        <CommandItem
                                            key={`delete-${exclusion.id}`}
                                            className="items-start text-left mr-1"
                                        >
                                            {(userName ===
                                                exclusion.user.username ||
                                                userRole === "ADMIN") && (
                                                <QueryDeleteButton
                                                    id={exclusion.id}
                                                    data={exclusion.pattern}
                                                    deleteItemType={
                                                        "Path exclusion"
                                                    }
                                                />
                                            )}
                                        </CommandItem>
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
