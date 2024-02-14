// SPDX-FileCopyrightText: Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect, useMemo, useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    RowData,
    useReactTable,
} from "@tanstack/react-table";
import debounce from "lodash.debounce";
import {
    parseAsInteger,
    parseAsString,
    useQueryState,
} from "next-usequerystate";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/package_library/DataTablePagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
}

declare module "@tanstack/table-core" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        editedRows: { [key: number]: boolean };
        setEditedRows: React.Dispatch<
            React.SetStateAction<{ [key: number]: boolean }>
        >;
        revertData: (rowId: number, revert: boolean) => void;
        updateData: (rowId: number, columnId: string, value: string) => void;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        type?: string;
    }
}

export function DataTable<TData, TValue>({
    columns,
    data: initialData,
    pageCount,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = useState(initialData);
    const [editedRows, setEditedRows] = useState({});

    const [contextPurl, setContextPurl] = useQueryState(
        "contextPurl",
        parseAsString,
    );
    // The setPageIndex cannot be recognized as a callable expression without the pageIndex, so it
    // is added here and an eslint-disable-next-line is added to ignore the unused variable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pageIndex, setPageIndex] = useQueryState(
        "pageIndex",
        parseAsInteger.withDefault(1),
    );
    const [inputValue, setInputValue] = useState<string>(contextPurl || "");
    const debounceSetPurl = useMemo(
        () => debounce(setContextPurl, 300),
        [setContextPurl],
    );

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        meta: {
            editedRows,
            setEditedRows,
            revertData: (rowId: number, revert: boolean) => {
                if (revert) {
                    setData((old) =>
                        old.map((row, index) =>
                            index === rowId ? initialData[rowId] : row,
                        ),
                    );
                } else {
                    setData((old) =>
                        old.map((row, index) =>
                            index === rowId ? data[rowId] : row,
                        ),
                    );
                }
            },
            updateData: (rowId: number, columnId: string, value: string) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowId) {
                            return {
                                ...old[rowId]!,
                                [columnId]: value,
                            };
                        }
                        return row;
                    }),
                );
            },
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <Input
                    placeholder="Search packages by purl"
                    value={inputValue ?? ""}
                    onChange={(event) => {
                        setInputValue(event.target.value);
                        if (event.target.value === "") {
                            debounceSetPurl(null);
                        } else {
                            debounceSetPurl(event.target.value);
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
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
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
