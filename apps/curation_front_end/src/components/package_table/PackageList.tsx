// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import { ZodiosResponseByPath } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { columns } from "@/components/package_table/columns";
import { DataTable } from "@/components/package_table/DataTable";

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
