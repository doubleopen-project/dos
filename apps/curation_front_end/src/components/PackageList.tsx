// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { columns } from "@/components/datatable/columns";
import { DataTable } from "./datatable/data-table";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";

type PackageListProps = {
    data: ZodiosResponseByPath<typeof userAPI, "get", "/packages">;
};

const PackageList = ({ data }: PackageListProps) => {
    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={data.packages} />
        </div>
    );
};

export default PackageList;
