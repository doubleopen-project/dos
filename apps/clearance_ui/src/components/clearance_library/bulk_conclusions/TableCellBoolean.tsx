// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { Checkbox } from "@/components/ui/checkbox";

type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusions"
>["bulkConclusions"][0];

const TableCellBoolean = ({
    getValue,
    row,
    column,
    table,
}: CellContext<BulkConclusion, unknown>) => {
    const initialValue = getValue();
    const tableMeta = table.options.meta;
    const [value, setValue] = useState(
        typeof initialValue === "boolean" ? initialValue : false,
    );

    useEffect(() => {
        setValue(typeof initialValue === "boolean" ? initialValue : false);
    }, [initialValue]);

    const onBlur = () => {
        tableMeta?.updateData(row.index, column.id, value);
    };

    if (tableMeta?.selectedRowsForEditing[parseInt(row.id)]) {
        return (
            <Checkbox
                checked={value}
                onCheckedChange={(newValue) => {
                    setValue(newValue.valueOf() as boolean);
                }}
                onBlur={onBlur}
                name={column.id}
                aria-label={column.id}
            />
        );
    }

    return <span>{value ? "Yes" : "No"}</span>;
};

export default TableCellBoolean;
