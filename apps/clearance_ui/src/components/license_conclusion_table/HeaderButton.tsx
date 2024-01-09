// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Column } from "@tanstack/react-table";
import { ZodiosResponseByAlias } from "@zodios/core";
import {
    ChevronDownIcon,
    ChevronsUpDownIcon,
    ChevronUpIcon,
} from "lucide-react";
import { userAPI } from "validation-helpers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type LicenseConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetLicenseConclusions"
>["licenseConclusions"][0];

const HeaderButton = ({
    column,
    label,
}: {
    column: Column<LicenseConclusion, unknown>;
    label: string;
}) => {
    return (
        <Button
            variant="ghost"
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            <Label className="cursor-pointer font-bold">{label}</Label>
            {column.getIsSorted() === "desc" ? (
                <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
                <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : (
                <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            )}
        </Button>
    );
};

export default HeaderButton;
