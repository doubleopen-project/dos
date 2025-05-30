// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getErrorMessage } from "@/helpers/getErrorMessage";

type Props = {
    pathExclusionId: number;
};

const PEAffectedFilesTooltip = ({ pathExclusionId }: Props) => {
    const { data, isLoading, error } =
        userHooks.useGetAffectedFilesForPathExclusion({
            params: {
                id: pathExclusionId,
            },
        });

    return (
        <>
            {isLoading && (
                <Badge className="bg-blue-400 text-sm">
                    <Loader2 className="animate-spin" size={20} />
                </Badge>
            )}
            {error && (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                            <Badge className="bg-red-400 text-sm">!</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="text-sm">
                                Error: {getErrorMessage(error)}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            {data && (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                            <Badge className="bg-blue-400 text-xs">
                                {data.affectedFiles.length}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="max-h-[40vh] max-w-[50vh] overflow-y-auto text-xs">
                                {data.affectedFiles.map((aff, index) => (
                                    <div key={index}>{aff}</div>
                                ))}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </>
    );
};

export default PEAffectedFilesTooltip;
