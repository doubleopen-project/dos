// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useRouter } from "next/router";
import { PackageURL } from "packageurl-js";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ClearanceToolbar from "@/components/ClearanceToolbar";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

const Details = () => {
    const router = useRouter();
    const purl = router.query.purl as string;
    const parsedPurl = parsePurlAndQualifiers(purl);
    const mainPurl = new PackageURL(
        parsedPurl.type,
        parsedPurl.namespace,
        parsedPurl.name,
        parsedPurl.version,
        null,
        null,
    ).toString();
    return (
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
            <div className="flex-1 border p-2">
                <h3 className="font-semibold">Package Information</h3>

                <Table className="mt-2 w-fit border p-2">
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-right font-semibold">
                                Name:
                            </TableCell>
                            <TableCell>{parsedPurl.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-right font-semibold">
                                Version:
                            </TableCell>
                            <TableCell>{parsedPurl.version}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-right font-semibold">
                                Type:
                            </TableCell>
                            <TableCell>{parsedPurl.type}</TableCell>
                        </TableRow>
                        {parsedPurl.namespace && (
                            <TableRow>
                                <TableCell className="text-right font-semibold">
                                    Namespace:
                                </TableCell>
                                <TableCell>{parsedPurl.namespace}</TableCell>
                            </TableRow>
                        )}
                        {parsedPurl.subpath && (
                            <TableRow>
                                <TableCell className="text-right font-semibold">
                                    Subpath:
                                </TableCell>
                                <TableCell>{parsedPurl.subpath}</TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell className="text-right font-semibold">
                                Clean PURL:
                            </TableCell>
                            <TableCell>{mainPurl}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-right font-semibold">
                                Full PURL:
                            </TableCell>
                            <TableCell>{purl}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Details;
