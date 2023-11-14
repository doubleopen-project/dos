// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ZodiosResponseByPath } from "@zodios/core";
import { parseAsInteger, useQueryState } from "next-usequerystate";
import React, { useMemo } from "react";
import { userAPI } from "validation-helpers";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;
type LicenseMatch = DataType["licenseFindings"][0]["licenseFindingMatches"][0];

// Define type for component props
type ButtonGroupProps = {
    data?: LicenseMatch[];
};

const ButtonGroup = ({ data = [] }: ButtonGroupProps) => {
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
        <div className="flex flex-wrap">
            <Button
                key="reset"
                className="p-0.5 m-0.5 text-xs h-fit"
                onClick={() => {
                    setLicenseMatchId(null);
                }}
            >
                RESET
            </Button>
            {uniqueData.map((d) => (
                <TooltipProvider key={d.id}>
                    <Tooltip delayDuration={400}>
                        <TooltipTrigger asChild>
                            <Button
                                key={d.id}
                                className={`p-0.5 m-0.5 text-xs h-fit ${
                                    licenseMatchId === d.id
                                        ? "bg-red-300 hover:bg-red-300"
                                        : "hover:bg-gray-400"
                                }`}
                                variant="secondary"
                                onClick={() => {
                                    setLicenseMatchId(d.id);
                                }}
                            >
                                {d.startLine}:{" "}
                                {d.licenseExpression
                                    ? d.licenseExpression
                                    : "null"}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">
                            <span>
                                Timestamp: {new Date(d.updatedAt).toISOString()}
                                <br />
                                Score: {d.score}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
};

export default ButtonGroup;
