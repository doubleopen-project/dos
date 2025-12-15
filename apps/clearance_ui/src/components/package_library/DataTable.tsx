// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useMemo, useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { debounce } from "es-toolkit/function";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/common/table/DataTablePagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
}: DataTableProps<TData, TValue>) {
    const [name, setName] = useQueryState("name", parseAsString);
    // The setPageIndex cannot be recognized as a callable expression without the pageIndex, so it
    // is added here and an eslint-disable-next-line is added to ignore the unused variable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pageIndex, setPageIndex] = useQueryState(
        "pageIndex",
        parseAsInteger.withDefault(1),
    );
    const [inputValue, setInputValue] = useState<string>(name || "");

    const debounceSetFilterValue = useMemo(
        () => debounce(setName, 300),
        [setName],
    );

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <Input
                    placeholder="Search packages by name"
                    id="search"
                    value={inputValue ?? ""}
                    onChange={(event) => {
                        setInputValue(event.target.value);
                        if (event.target.value === "") {
                            debounceSetFilterValue(null);
                        } else {
                            debounceSetFilterValue(event.target.value);
                        }
                        setPageIndex(1);
                    }}
                    className="max-w-sm"
                    autoFocus
                />
                <DataTablePagination table={table} />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="p-2"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
