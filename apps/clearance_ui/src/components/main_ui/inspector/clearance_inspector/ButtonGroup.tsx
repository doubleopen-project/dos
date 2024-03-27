// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";
import { ZodiosResponseByAlias } from "@zodios/core";
import { parseAsInteger, useQueryState } from "nuqs";
import { userAPI } from "validation-helpers";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { replaceSpecialCharacters } from "@/helpers/replaceSpecialCharacters";
import { cn } from "@/lib/utils";

type DataType = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseFindingsForFile"
>;
type LicenseMatch = DataType["licenseFindings"][0]["licenseFindingMatches"][0];

// Define type for component props
type ButtonGroupProps = {
    data?: LicenseMatch[];
    className?: string;
};

const ButtonGroup = ({ data = [], className }: ButtonGroupProps) => {
    const [licenseMatchId, setLicenseMatchId] = useQueryState(
        "licenseMatchId",
        parseAsInteger,
    );

    // Sort and filter data by startLine and license, only when data changes
    const uniqueData = useMemo(() => {
        const seen = new Set();
        const sortedAndFilteredData = [...data]
            .sort((a, b) => a.startLine - b.startLine)
            .filter((d) => {
                const identifier = `${d.startLine}-${d.licenseExpression}`;
                if (seen.has(identifier)) {
                    return false;
                }
                seen.add(identifier);
                return true;
            });
        return sortedAndFilteredData;
    }, [data]);

    return (
        <div className={cn("flex flex-col items-start", className)}>
            <Button
                key="reset"
                className="m-0.5 h-fit bg-[#C6CAED] p-0.5 text-xs hover:bg-[#313C9B] hover:text-white dark:bg-[#313C9B] dark:hover:bg-[#C6CAED] dark:hover:text-black"
                onClick={() => {
                    setLicenseMatchId(null);
                }}
            >
                RESET
            </Button>
            {uniqueData.map((d) => {
                // Pick a color class according to the matched license
                // expression. Use a "normalized" version of the license name,
                // where some special characters are replaced with "_".
                const spdx = d.licenseExpression!;
                const compound =
                    spdx.includes("AND") ||
                    spdx.includes("OR") ||
                    spdx.includes("WITH");
                const expression = !compound && replaceSpecialCharacters(spdx);
                const circleColor = compound
                    ? "bg-gray-400"
                    : `bg-${expression}`;
                return (
                    <TooltipProvider delayDuration={300} key={d.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    key={d.id}
                                    className={`m-0.5 h-fit p-0.5 text-xs ${
                                        licenseMatchId === d.id
                                            ? "bg-red-300 hover:bg-red-300 dark:text-black"
                                            : "bg-gray-200 hover:bg-gray-400 dark:bg-gray-400 dark:text-black dark:hover:bg-gray-200"
                                    }`}
                                    variant="secondary"
                                    onClick={() => {
                                        setLicenseMatchId(d.id);
                                    }}
                                >
                                    <span
                                        className={`mx-1 h-3 w-3 rounded-full border ${circleColor}`}
                                    ></span>
                                    {d.startLine}:{" "}
                                    {d.licenseExpression
                                        ? d.licenseExpression
                                        : "null"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">
                                <span>
                                    Timestamp:{" "}
                                    {new Date(d.updatedAt).toISOString()}
                                    <br />
                                    Score: {d.score}
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            })}
        </div>
    );
};

export default ButtonGroup;
