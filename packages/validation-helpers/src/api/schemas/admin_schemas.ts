// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";
import { getPasswordSchema, getUsernameSchema } from "./common_schemas";

//---------------- DELETE scan-results ----------------

export const DeleteScanResultsReq = z.object({
    purl: z.string({
        required_error: "Purl is required",
    }),
});

export const DeleteScanResultsRes = z.object({
    message: z.string(),
});

//------------------- POST users -------------------

export const PostUsersReq = z.object({
    username: getUsernameSchema(true),
    password: getPasswordSchema(true),
    passwordIsTemporary: z.boolean().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
});

export const PostUsersRes = z.object({
    id: z.string().uuid(),
    username: z.string(),
    realmRoles: z.array(z.string()),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
    requiredActions: z.array(z.string()).optional(),
});

//------------------- DELETE user -------------------

export const DeleteUserRes = z.object({
    message: z.string(),
});

//----------------- POST purl-cleanup ----------------

export const PostPurlCleanupReq = z.object({
    options: z
        .object({
            dryRun: z.boolean().optional(),
            pkgNameStartsWith: z.string().optional(),
            allPhases: z.boolean().optional(),
            transferPathExclusions: z.boolean().optional(),
            transferBulkConclusions: z.boolean().optional(),
            changeContextPurls: z.boolean().optional(),
            deleteOldPurlBookmarks: z.boolean().optional(),
        })
        .optional(),
});

export const PostPurlCleanupRes = z.object({
    message: z.string(),
    optionDescriptions: z.object({
        dryRun: z.string(),
        pkgNameStartsWith: z.string(),
        allPhases: z.string(),
        transferPathExclusions: z.string(),
        transferBulkConclusions: z.string(),
        changeContextPurls: z.string(),
        deleteOldPurlBookmarks: z.string(),
    }),
});

//------------------ GET packages -------------------
export const QueryParamSortPkgBy = z
    .enum([
        "purl",
        "name",
        "version",
        "type",
        "namespace",
        "createdAt",
        "updatedAt",
    ])
    .optional();

export const GetPackagesRes = z.object({
    packages: z.array(
        z.object({
            purl: z.string(),
            updatedAt: z.coerce.date(),
            name: z.string(),
            version: z.nullable(z.string()),
            type: z.string(),
            namespace: z.nullable(z.string()),
            qualifiers: z.nullable(z.string()),
            subpath: z.nullable(z.string()),
        }),
    ),
});

// Curator schemas

const Curator = z.object({
    id: z.string(),
    remoteId: z.string(),
    username: z.string(),
});

//---------------- GET curators ----------------

export const GetCuratorsRes = z.array(Curator);

//---------------- POST curator ----------------

export const PostCuratorReq = z.object({
    remoteId: z.string().uuid(),
});

export const PostCuratorRes = Curator;

//---------------- PUT reassign clearance items ----------------

export const PutReassignClearanceItemsReq = z.object({
    curatorId: z.string().uuid(),
    newCuratorId: z.string().uuid(),
});

export const PutReassignClearanceItemsRes = z.object({
    message: z.string(),
    counts: z.object({
        pathExclusions: z.number(),
        bulkConclusions: z.number(),
        licenseConclusions: z.number(),
    }),
});

//---------------- Clearance Group Schemas ----------------

export const CuratorRoleEnum = z.enum(["READER", "WRITER"]);

export const ClearanceGroup = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const ClearanceGroupWithCurators = ClearanceGroup.extend({
    curators: z.array(
        z.object({
            curator: z.object({
                id: z.string(),
                remoteId: z.string(),
                username: z.string(),
            }),
            role: CuratorRoleEnum,
        }),
    ),
});

//-------------- POST clearance-group --------------

export const PostClearanceGroupReq = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
});

//-------------- PATCH clearance-group --------------

export const PatchClearanceGroupReq = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
});

//--------------- GET clearance-groups --------------

export const GetClearanceGroupsRes = z.array(ClearanceGroup);

const ClearanceGroupSortByEnum = z.enum([
    "id",
    "name",
    "createdAt",
    "updatedAt",
]);

export const QueryParamClearanceGroupSortBy =
    ClearanceGroupSortByEnum.optional();

export type ClearanceGroupSortBy = z.infer<typeof ClearanceGroupSortByEnum>;

//------------ POST clearance-group curators ------------

export const PostCuratorsToClearanceGroupReq = z.object({
    curators: z.array(
        z.object({
            id: z.string().uuid(),
            role: CuratorRoleEnum,
        }),
    ),
});

//------------ POST assign clearance items ------------

export const PostAssignClearanceItemsToClearanceGroupReq = z.object({
    curatorId: z.string().uuid(),
});

export const PostAssignClearanceItemsToClearanceGroupRes = z.object({
    added: z.object({
        licenseConclusions: z.object({ linksCreated: z.number() }),
        bulkConclusions: z.object({ linksCreated: z.number() }),
        pathExclusions: z.object({ linksCreated: z.number() }),
    }),
    removed: z.object({
        licenseConclusions: z.object({ linksDeleted: z.number() }),
        bulkConclusions: z.object({ linksDeleted: z.number() }),
        pathExclusions: z.object({ linksDeleted: z.number() }),
    }),
});
