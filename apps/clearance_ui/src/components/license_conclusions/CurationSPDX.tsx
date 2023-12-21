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
};

const CurationSPDX = ({ value, setValue }: Props) => {
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <div className="flex">
            <Input
                className="w-full text-xs rounded-md"
                type="text"
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
                                "mx-2 text-gray-400 h-fit",
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

export default CurationSPDX;
