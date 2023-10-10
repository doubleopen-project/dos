// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useMemo } from 'react';
import { Button } from "./ui/button";
import { 
    Tooltip,
    TooltipTrigger,
    TooltipProvider,
    TooltipContent
} from "./ui/tooltip";
import { ZodiosResponseByPath } from '@zodios/core';
import { userAPI } from 'validation-helpers';
import { parseAsInteger, useQueryState } from 'next-usequerystate';

type DataType = ZodiosResponseByPath<typeof userAPI, 'post', '/file'>;
type LicenseMatch = DataType["licenseFindings"][0]["licenseFindingMatches"][0];

// Define type for component props
type ButtonGroupProps = {
    data?: LicenseMatch[];
}

const ButtonGroup = ({ data = [] }: ButtonGroupProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [line, setLine] = useQueryState('line', parseAsInteger.withDefault(1));

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
        <div className='flex flex-wrap'>
            <Button 
                key="reset"
                className="p-0.5 m-0.5 text-xs h-fit"
                onClick={() => {
                    setSelectedId(null);
                    setLine(1);
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
                                className={`p-0.5 m-0.5 text-xs h-fit ${selectedId === d.id ? 
                                    "bg-red-300 hover:bg-red-300" : 
                                    "hover:bg-slate-200"}`}
                                variant="secondary"
                                onClick={() => {
                                    setSelectedId(d.id);
                                    setLine(d.startLine);
                                }}
                            >
                                {d.startLine}: {d.licenseExpression ? d.licenseExpression : "null"}
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
    )
}

export default ButtonGroup;