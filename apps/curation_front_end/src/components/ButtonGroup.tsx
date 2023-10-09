// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useMemo } from 'react';
import { Button } from "./ui/button";
import { ZodiosResponseByPath } from '@zodios/core';
import { guestAPI } from 'validation-helpers';
import { parseAsInteger, useQueryState } from 'next-usequerystate';

type DataType = ZodiosResponseByPath<typeof guestAPI, 'post', '/file'>;
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
        <div className='bg-slate-300 p-1 rounded-md w-full shadow'>
            <div className='flex flex-wrap'>
                <Button 
                    key="reset"
                    className="p-1 m-1 text-xs h-fit"
                    onClick={() => {
                        setSelectedId(null);
                        setLine(1);
                    }}
                >
                    RESET
                </Button>
                {uniqueData.map((d) => (
                    <Button 
                        key={d.id}
                        className={`p-1 m-1 text-xs h-fit ${selectedId === d.id ? 
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
                ))}
            </div>
        </div>
    )
}

export default ButtonGroup;