// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI, validReasons } from "validation-helpers";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusions"
>["pathExclusions"][number];

const TableCellSelect = ({
    getValue,
    row,
    column,
    table,
}: CellContext<PathExclusion, unknown>) => {
    const initialValue = getValue();
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const [value, setValue] = useState(
        typeof initialValue === "string" ? initialValue : "",
    );

    useEffect(() => {
        setValue(typeof initialValue === "string" ? initialValue : "");
    }, [initialValue]);

    if (tableMeta?.selectedRowsForEditing[parseInt(row.id)]) {
        return (
            <Select
                value={value}
                onValueChange={(selected) => {
                    tableMeta?.updateData(row.index, column.id, selected);
                    setValue(selected);
                }}
                name={column.id}
                aria-label={column.id}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a valid reason..." />
                </SelectTrigger>
                <SelectContent>
                    {validReasons.map((reason) => (
                        <SelectGroup key={reason.name}>
                            <SelectItem
                                value={reason.name}
                                className="py-0.5 text-xs"
                            >
                                {reason.name}
                            </SelectItem>
                            <SelectLabel className="text-muted-foreground mb-1 ml-5 py-0.5 text-xs font-normal italic">
                                {reason.description}
                            </SelectLabel>
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        );
    }
    return (
        <span className={columnMeta?.breakAll ? "break-all" : undefined}>
            {value}
        </span>
    );
};

export default TableCellSelect;
