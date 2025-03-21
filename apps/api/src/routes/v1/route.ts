// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { initServer } from "@ts-rest/express";
import { contract } from "validation-helpers";
import { findScannedPackages } from "../../helpers/db_queries";
import { authzPermission } from "../../middlewares/authz_permission";

const s = initServer();

export const router = s.router(contract, {
    getPackages: {
        middleware: [
            authzPermission({ resource: "Packages", scopes: ["GET"] }),
        ],
        handler: async ({ query: query }) => {
            try {
                const pageSize = query.pageSize;
                const pageIndex = query.pageIndex;
                const skip = pageSize && pageIndex ? pageSize * pageIndex : 0;

                const packages = await findScannedPackages(
                    skip,
                    pageSize,
                    // If sortBy and sortOrder are not provided, default to descending order by updatedAt
                    query.sortBy || "updatedAt",
                    !query.sortBy && !query.sortOrder
                        ? "desc"
                        : query.sortOrder,
                    query.name,
                    query.version,
                    query.type,
                    query.namespace,
                    query.purl,
                    query.createdAtGte,
                    query.createdAtLte,
                    query.updatedAtGte,
                    query.updatedAtLte,
                );
                return { status: 200, body: { packages: packages } };
            } catch (error) {
                console.log("Error: ", error);
                return {
                    status: 500,
                    body: { message: "Internal server error" },
                };
            }
        },
    },
});
