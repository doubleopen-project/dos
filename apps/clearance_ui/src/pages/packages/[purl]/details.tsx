// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useRouter } from "next/router";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import ClearanceToolbar from "@/components/ClearanceToolbar";

const Details = () => {
    const router = useRouter();
    const purl = router.query.purl as string;
    return (
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
            <div className="flex-1 border p-2">
                <Label className="font-semibold">Package Information</Label>
                <div className="rounded-lg border p-2">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Name
                                </TableCell>
                                <TableCell>dos-monorepo</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">
                                    Version
                                </TableCell>
                                <TableCell>0.0.0</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Details;
