// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import useContextStore from "@/store/context.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { clearanceGroupColor } from "@/helpers/stringToColour";
import { cn } from "@/lib/utils";

const ClearanceGroupSelector = ({ className }: { className?: string }) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const selectedGroup = useContextStore((s) => s.selectedClearanceGroup);
    const setSelectedClearanceGroup = useContextStore(
        (s) => s.setSelectedClearanceGroup,
    );

    const { data } = userHooks.useGetUserClearanceGroups();

    useEffect(() => {
        if (selectedGroup === undefined && data && data.writer.length > 0) {
            setSelectedClearanceGroup(data.writer[0]);
        } else if (
            data &&
            !data.writer.find((g) => g.id === selectedGroup?.id)
        ) {
            // Selected group ID is no longer valid, reset to undefined.
            setSelectedClearanceGroup(undefined);
        }
    }, [data, selectedGroup, setSelectedClearanceGroup]);

    return (
        <div className={cn("flex items-center", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        {selectedGroup && (
                            <span
                                className="h-2 w-2 rounded-[2px]"
                                style={{
                                    backgroundColor: clearanceGroupColor(
                                        selectedGroup.name,
                                    ),
                                }}
                                aria-hidden="true"
                            />
                        )}
                        <span className="max-w-[220px] truncate">
                            {selectedGroup?.name ||
                                "No groups with write access"}
                        </span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[360px] p-3">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <div className="text-muted-foreground text-xs font-medium">
                                Writable
                            </div>

                            {data?.writer.length === 0 ? (
                                <div className="text-muted-foreground text-xs">
                                    You don’t have write access to any clearance
                                    groups.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {data?.writer.map((g) => {
                                        const isSelected =
                                            selectedGroup?.id === g.id;
                                        return (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedClearanceGroup(g)
                                                }
                                                className="rounded-full"
                                            >
                                                <Badge
                                                    variant={"secondary"}
                                                    style={{
                                                        backgroundColor:
                                                            clearanceGroupColor(
                                                                g.name,
                                                            ),
                                                    }}
                                                    className={cn("gap-1")}
                                                >
                                                    {isSelected && (
                                                        <Check className="h-3.5 w-3.5" />
                                                    )}
                                                    <span className="max-w-[220px] truncate">
                                                        {g.name}
                                                    </span>
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="text-muted-foreground text-xs font-medium">
                                Read-only
                            </div>

                            {data?.reader.length === 0 ? (
                                <div className="text-muted-foreground text-xs">
                                    No read-only groups.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {data?.reader.map((g) => (
                                        <Badge
                                            key={g.id}
                                            variant="secondary"
                                            style={{
                                                backgroundColor:
                                                    clearanceGroupColor(g.name),
                                            }}
                                        >
                                            <span className="max-w-[220px] truncate">
                                                {g.name}
                                            </span>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default ClearanceGroupSelector;
