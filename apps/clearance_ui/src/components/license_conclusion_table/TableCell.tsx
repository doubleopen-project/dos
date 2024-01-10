// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react";
import { CellContext } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

const TableCell = ({
    getValue,
    row,
    column,
    table,
}: CellContext<LicenseConclusion, unknown>) => {
    const initialValue = getValue();
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const [value, setValue] = useState(
        typeof initialValue === "string" ? initialValue : "",
    );

    useEffect(() => {
        setValue(typeof initialValue === "string" ? initialValue : "");
    }, [initialValue]);

    const onBlur = () => {
        tableMeta?.updateData(row.index, column.id, value);
    };

    if (tableMeta?.editedRows[parseInt(row.id)]) {
        return columnMeta?.type === "textarea" ? (
            <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                name={column.id}
                aria-label={column.id}
            />
        ) : (
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                type={"text"}
                name={column.id}
                aria-label={column.id}
            />
        );
    }
    return <span>{value}</span>;
};

export default TableCell;
