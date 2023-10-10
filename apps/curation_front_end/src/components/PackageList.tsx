// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import type { GetPackagesResType } from "validation-helpers";
import { columns } from "@/components/datatable/columns";
import { DataTable } from "./datatable/data-table";

type PackageListProps = {
  data: GetPackagesResType;
};

const PackageList = ({ data }: PackageListProps) => {
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data.packages.map((pkg) => ({
          purl: pkg.purl,
          updatedAt: pkg.updatedAt,
        }))}
      />
    </div>
  );
};

export default PackageList;
