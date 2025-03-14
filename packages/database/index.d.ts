// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import * as _prisma_client_runtime_library from "@prisma/client/runtime/library";
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
    _prisma_client.Prisma.TypeMapCb<_prisma_client.Prisma.PrismaClientOptions>,
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

export { prisma };
