// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { clearanceGroupColor } from "@/helpers/stringToColour";

const ClearanceGroupTooltipIcon = ({
    clearanceGroup,
}: {
    clearanceGroup: {
        id: number;
        name: string;
    };
}) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-[.625rem]"
                        style={{
                            backgroundColor: clearanceGroupColor(
                                clearanceGroup.name,
                            ),
                        }}
                        aria-label={clearanceGroup.name}
                    >
                        {clearanceGroup.id}
                    </span>
                </TooltipTrigger>
                <TooltipContent>{clearanceGroup.name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ClearanceGroupTooltipIcon;
