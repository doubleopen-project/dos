// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { PackageURL } from "packageurl-js";
import { userHooks } from "@/hooks/zodiosHooks";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    bulkConclusionId: number;
    badgeStyle: string;
    queryPurl?: string;
    mode?: "context" | "additional" | "query";
};

const BCAffectedFilesTooltip = ({
    bulkConclusionId,
    badgeStyle,
    queryPurl,
    mode,
}: Props) => {
    const { data, isLoading, error } =
        userHooks.useGetAffectedFilesForBulkConclusion({
            withCredentials: true,
            params: {
                id: bulkConclusionId,
            },
            queries: {
                purl: queryPurl,
            },
        });

    return (
        <>
            {isLoading && (
                <Badge className={badgeStyle}>
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
                                Error: Unable to fetch affected files
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            {data &&
            ((mode === "context" &&
                data.affectedFiles.inContextPurl.length > 0) ||
                (mode === "additional" &&
                    data.affectedFiles.additionalMatches.length > 0) ||
                (mode === "query" &&
                    data.affectedFiles.inQueryPurl.length > 0)) ? (
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                            <Badge className={badgeStyle}>
                                {mode === "context" &&
                                    data.affectedFiles.inContextPurl.length}
                                {mode === "additional" &&
                                    data.affectedFiles.additionalMatches.length}
                                {mode === "query" &&
                                    data.affectedFiles.inQueryPurl.length}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="max-h-[40vh] max-w-[50vh] overflow-y-auto text-xs">
                                {mode === "context" &&
                                    data.affectedFiles.inContextPurl.map(
                                        (aff, index) => (
                                            <div key={index}>{aff}</div>
                                        ),
                                    )}
                                {mode === "additional" &&
                                    data.affectedFiles.additionalMatches.map(
                                        (aff, index) => (
                                            <div key={index}>
                                                {
                                                    PackageURL.fromString(
                                                        aff.purl,
                                                    ).name
                                                }
                                                :
                                                {
                                                    PackageURL.fromString(
                                                        aff.purl,
                                                    ).version
                                                }{" "}
                                                : {aff.path}
                                            </div>
                                        ),
                                    )}
                                {mode === "query" &&
                                    data.affectedFiles.inQueryPurl.map(
                                        (aff, index) => (
                                            <div key={index}>{aff}</div>
                                        ),
                                    )}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : null}
        </>
    );
};

export default BCAffectedFilesTooltip;
