// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { userHooks } from "@/hooks/zodiosHooks";
import { Loader2 } from "lucide-react";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import QueryDeleteButton from "@/components/QueryDeleteButton";

type Props = {
    purl: string | undefined;
};

const ExclusionList = ({ purl }: Props) => {
    const { data, isLoading, error } = userHooks.useImmutableQuery(
        "/path-exclusions",
        { purl: purl as string },
        { withCredentials: true },
        { enabled: !!purl },
    );

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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="p-1 text-xs rounded-md"
                        >
                            List path exclusions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-[70vh] min-h-[1px] overflow-y-auto">
                        {data.pathExclusions.map((exclusion) => (
                            <div
                                key={`wrapper-${exclusion.id}`}
                                className="flex items-start justify-between"
                            >
                                <DropdownMenuItem
                                    key={exclusion.id}
                                    className="items-start flex-1 text-left"
                                >
                                    <div className="flex flex-col w-full text-xs">
                                        <span className="flex justify-between mb-2">
                                            <span>
                                                <span className="mr-1">
                                                    Glob:
                                                </span>
                                                <span className="p-1 font-bold bg-green-400 rounded-sm">
                                                    {exclusion.pattern}
                                                </span>
                                            </span>
                                            <span className="">
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
                                                    {exclusion.user.username}
                                                </span>
                                            </span>
                                        </span>
                                        <span className="text-smaller">
                                            <span className="mr-1">
                                                Reason:
                                            </span>
                                            <span>{exclusion.reason}</span>
                                        </span>
                                        <span className="italic text-smaller">
                                            {exclusion.comment}
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    key={`delete-${exclusion.id}`}
                                    className="items-start text-left"
                                >
                                    {(userName === exclusion.user.username ||
                                        userRole === "ADMIN") && (
                                        <QueryDeleteButton
                                            id={exclusion.id}
                                            data={exclusion.pattern}
                                            deleteQuery={"/path-exclusion/:id"}
                                        />
                                    )}
                                </DropdownMenuItem>
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    );
};

export default ExclusionList;
