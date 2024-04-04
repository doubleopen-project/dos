// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { RowData } from "@tanstack/react-table";

declare module "@tanstack/table-core" {
    // Meta data for the table and columns that is accessible in the DataTable
    // component, the columns object and different cell components.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData extends RowData> {
        // Keeps track of the rows that are being edited to enable showing
        // the editable cell components.
        editedRows: { [key: number]: boolean };
        setEditedRows: React.Dispatch<
            React.SetStateAction<{ [key: number]: boolean }>
        >;
        // Function used to revert the data of a row to the original data.
        revertData: (rowId: number, revert: boolean) => void;
        // Function used to update the data of a row.
        updateData: (rowId: number, columnId: string, value: string) => void;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        // The type of the column, used to determine the type of the cell
        type?: string;
    }
}
