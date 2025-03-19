// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { PrismaPg } from "@prisma/adapter-pg";
import * as _prisma_client_runtime_library from "@prisma/client/runtime/library";
import { Pool } from "pg";
import * as _prisma_client from ".prisma/client";

export * from "@prisma/client";

declare const prisma: _prisma_client_runtime_library.DynamicClientExtensionThis<
    _prisma_client.Prisma.TypeMap<
        _prisma_client_runtime_library.InternalArgs & {
            result: {
                licenseFinding: {
                    licenseExpressionSPDX: () => {
                        needs: {
                            unprocessedLicenseExpressionSPDX: true;
                        };
                        compute(licenseFinding: {
                            unprocessedLicenseExpressionSPDX: string;
                        }): string;
                    };
                };
            };
            model: {};
            query: {};
            client: {};
        },
        {}
    >,
    _prisma_client.Prisma.TypeMapCb<{
        log: "info"[];
        adapter: PrismaPg;
    }>,
    {
        result: {
            licenseFinding: {
                licenseExpressionSPDX: () => {
                    needs: {
                        unprocessedLicenseExpressionSPDX: true;
                    };
                    compute(licenseFinding: {
                        unprocessedLicenseExpressionSPDX: string;
                    }): string;
                };
            };
        };
        model: {};
        query: {};
        client: {};
    }
>;
declare const connectionPool: Pool;

export { connectionPool, prisma };
