// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { PackageURL } from "packageurl-js";
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
    licenseConclusionId: number;
    badgeStyle: string;
    queryPurl?: string;
    mode?: "context" | "additional" | "query";
};

const LCAffectedFilesTooltip = ({
    licenseConclusionId,
    badgeStyle,
    queryPurl,
    mode,
}: Props) => {
    const session = useSession();
    const { data, isLoading, error } =
        userHooks.useGetAffectedFilesForLicenseConclusion({
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
            params: {
                id: licenseConclusionId,
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
                                Error: {getErrorMessage(error)}
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
                                            <div key={index}>{aff.path}</div>
                                        ),
                                    )}
                                {mode === "additional" &&
                                    data.affectedFiles.additionalMatches.map(
                                        (aff, index) => (
                                            <div key={index}>
                                                {
                                                    PackageURL.fromString(
                                                        aff.package.purl,
                                                    ).name
                                                }
                                                :
                                                {
                                                    PackageURL.fromString(
                                                        aff.package.purl,
                                                    ).version
                                                }{" "}
                                                : {aff.path}
                                            </div>
                                        ),
                                    )}
                                {mode === "query" &&
                                    data.affectedFiles.inQueryPurl.map(
                                        (aff, index) => (
                                            <div key={index}>{aff.path}</div>
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

export default LCAffectedFilesTooltip;
