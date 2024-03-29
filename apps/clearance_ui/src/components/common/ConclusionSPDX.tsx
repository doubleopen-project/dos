// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
    value: string | undefined;
    setValue: (newSPDX: string) => void;
    className?: string;
};

const ConclusionSPDX = ({ value, setValue, className }: Props) => {
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <div className="flex">
            <Input
                className={cn(className, "w-full rounded-md text-xs")}
                name="spdx"
                placeholder="Write your SPDX expression here..."
                value={value}
                onChange={handleInput}
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger
                        className="ml-1"
                        type="button"
                        onClick={() => setValue("")}
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
                    <TooltipContent side="right">Clear field</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default ConclusionSPDX;
