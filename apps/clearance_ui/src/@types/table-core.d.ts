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
        selectedRowsForEditing: { [key: number]: boolean };
        setSelectedRowsForEditing: React.Dispatch<
            React.SetStateAction<{ [key: number]: boolean }>
        >;
        // Function used to revert the data of a row to the original data.
        revertData: (rowId: number) => void;
        // Function used to update the data of a row.
        updateData: (rowId: number, columnId: string, value: string) => void;
        // Function used to update persisted changes to the original data
        updateOriginalData: (rowId: number) => void;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        // The type of the column, used to determine the type of the cell
        type?: string;
        // Option to break the text from any point in the text in the cell.
        breakAll?: boolean;
    }
}
