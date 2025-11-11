// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { Package, Prisma } from "database";
import { getPresignedGetUrl } from "s3-helpers";
import { userAPI } from "validation-helpers";
import { CustomError } from "../helpers/custom_error";
import {
    fileTreeMatchingPatternExists,
    findFileTreesMatchingPattern,
} from "../helpers/db_operations";
import * as dbQueries from "../helpers/db_queries";
import { getErrorCodeAndMessage } from "../helpers/error_handling";
import { getUsers, updateUser } from "../helpers/keycloak_queries";
import { s3Client } from "../helpers/s3client";
import { authzPermission } from "../middlewares/authz_permission";

const userRouter = zodiosRouter(userAPI);

// ----------------------------------- USER ROUTES -----------------------------------

userRouter.put("/user", async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        if (
            ![username, password, email, firstName, lastName].some(
                (field) => field,
            )
        ) {
            throw new CustomError("At least one field is required", 400);
        }

        await updateUser(req.kauth.grant.access_token.content.sub, {
            username: username,
            credentials: password
                ? [{ type: "password", value: password, temporary: false }]
                : undefined,
            email: email,
            firstName: firstName,
            lastName: lastName,
        });

        res.status(200).send({ message: "User updated" });
    } catch (error) {
        if (error instanceof CustomError) {
            return res
                .status(error.statusCode)
                .json({ message: error.message, path: error.path });
        } else if (error instanceof Error) {
            return res.status(400).json({ message: error.message, path: null });
        } else {
            console.log("Error: ", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
});

const getUserIdArray = async (username: string, usernameStrict?: boolean) => {
    let userIds: string[] = [];

    if (usernameStrict) {
        const matchingUsers = await getUsers(username, true);
        if (matchingUsers.length === 1) userIds = [matchingUsers[0].id];
        else if (matchingUsers.length > 1)
            throw new CustomError(
                "Internal server error. Error in getUsers query: multiple users found with the same username with exact set to true",
                500,
            );
    } else {
        const matchingUsers = await getUsers(username);
        userIds = matchingUsers.map((user) => user.id);
    }

    return userIds;
};

userRouter.get(
    "/license-conclusions",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            // TODO: return only license conclusions that belong to the user
            // or to a group that the user belongs to

            // If a username filter is provided, get the user id(s) that match the username(s) from Keycloak
            const userIds = req.query.username
                ? await getUserIdArray(
                      req.query.username,
                      req.query.usernameStrict,
                  )
                : undefined;

            if (req.query.purl) {
                const pkg = await dbQueries.findPackageByPurl(req.query.purl);

                if (!pkg) {
                    throw new CustomError(
                        "Package with specified purl not found",
                        404,
                        "purl",
                    );
                }
            }

            const pageSize = req.query.pageSize;
            const pageIndex = req.query.pageIndex;
            const skip = pageSize && pageIndex ? pageSize * pageIndex : 0;

            const licenseConclusions = await dbQueries.findLicenseConclusions(
                // If sortBy is "username", the pagination will have to be handled in-memory
                req.query.sortBy !== "username" ? skip : undefined,
                req.query.sortBy !== "username" ? pageSize : undefined,
                // If sortBy and sortOrder are not provided, default to descending order by updatedAt
                // If sortBy is "username", the sorting will have to be handled in-memory
                req.query.sortBy !== "username"
                    ? req.query.sortBy || "updatedAt"
                    : undefined,
                req.query.sortBy !== "username"
                    ? !req.query.sortBy && !req.query.sortOrder
                        ? "desc"
                        : req.query.sortOrder
                    : undefined,
                req.query.purl,
                req.query.contextPurl,
                req.query.contextPurlStrict || false,
                userIds,
                req.query.detectedLicense,
                req.query.concludedLicense,
                req.query.comment,
                req.query.local,
                req.query.bulkConclusionId,
                req.query.hasBulkConclusionId,
                req.query.createdAtGte,
                req.query.createdAtLte,
                req.query.updatedAtGte,
                req.query.updatedAtLte,
            );

            // Get users from Keycloak server to be able to match user ids to usernames
            const users = await getUsers();

            // Add username to each license conclusion
            const lcsWithUsernames = licenseConclusions.map((lc) => {
                const username = users.find(
                    (u) => u.id === lc.userId,
                )?.username;
                if (!username) {
                    throw new CustomError(
                        "Internal server error: creator username not found",
                        500,
                    );
                }
                return {
                    ...lc,
                    user: {
                        username: username,
                    },
                };
            });

            let lcsToProcess = [...lcsWithUsernames];

            // Handle sorting and pagination in-memory if sortBy is "username"
            if (req.query.sortBy === "username") {
                // Sort by username
                lcsToProcess.sort((a, b) => {
                    if (a.user.username < b.user.username) return -1;
                    if (a.user.username > b.user.username) return 1;
                    return 0;
                });

                // Reverse the array if sortOrder is "desc"
                if (req.query.sortOrder === "desc") {
                    lcsToProcess.reverse();
                }

                // If pageSize is provided, slice the array
                if (pageSize) {
                    lcsToProcess = lcsToProcess.slice(skip, skip + pageSize);
                }
            }

            res.status(200).json({
                licenseConclusions: lcsToProcess,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/license-conclusions/count",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const userIds = req.query.username
                ? await getUserIdArray(
                      req.query.username,
                      req.query.usernameStrict,
                  )
                : undefined;

            if (req.query.purl) {
                const pkg = await dbQueries.findPackageByPurl(req.query.purl);

                if (!pkg) {
                    throw new CustomError(
                        "Package with specified purl not found",
                        404,
                        "purl",
                    );
                }
            }

            const licenseConclusionsCount =
                await dbQueries.countLicenseConclusions(
                    req.query.purl,
                    req.query.contextPurl,
                    req.query.contextPurlStrict || false,
                    userIds,
                    req.query.detectedLicense,
                    req.query.concludedLicense,
                    req.query.comment,
                    req.query.local,
                    req.query.bulkConclusionId,
                    req.query.hasBulkConclusionId,
                    req.query.createdAtGte,
                    req.query.createdAtLte,
                    req.query.updatedAtGte,
                    req.query.updatedAtLte,
                );

            res.status(200).json({ count: licenseConclusionsCount });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/license-conclusions/:id/affected-files",
    // @ts-expect-error - Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const licenseConclusionId = req.params.id;

            const licenseConclusion =
                await dbQueries.findLicenseConclusionById(licenseConclusionId);

            if (!licenseConclusion)
                throw new CustomError(
                    "License conclusion with the requested id does not exist",
                    404,
                );

            let queryPkg: Package | null = null;
            if (req.query.purl) {
                queryPkg = await dbQueries.findPackageByPurl(req.query.purl);

                if (!queryPkg) {
                    throw new CustomError(
                        "Package with specified purl not found",
                        404,
                        "purl",
                    );
                }
            }

            const contextPkg: Package | null =
                await dbQueries.findPackageByPurl(
                    licenseConclusion.contextPurl,
                );

            if (!contextPkg)
                throw new CustomError(
                    "Context package for license conclusion not found",
                    404,
                );

            const inContextPurl =
                await dbQueries.findFileTreesByPkgIdAndFileSha256(
                    licenseConclusion.fileSha256,
                    contextPkg.id,
                );

            const additionalMatches = licenseConclusion.local
                ? []
                : await dbQueries.findFileTreesByPkgIdAndFileSha256(
                      licenseConclusion.fileSha256,
                      undefined,
                      contextPkg.id,
                  );

            const inQueryPurl =
                req.query.purl && queryPkg
                    ? await dbQueries.findFileTreesByPkgIdAndFileSha256(
                          licenseConclusion.fileSha256,
                          queryPkg.id,
                      )
                    : [];

            res.status(200).json({
                affectedFiles: {
                    inContextPurl: inContextPurl,
                    additionalMatches: additionalMatches,
                    inQueryPurl: inQueryPurl,
                },
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/packages/:purl/files/:sha256/license-conclusions/",
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const fileSha256 = req.params.sha256;
            const purl = req.params.purl;

            let licenseConclusions =
                await dbQueries.findLicenseConclusionsByFileSha256(fileSha256);

            // Filter out license conclusions that have been marked as local
            // if the context package purl does not match the requested purl
            licenseConclusions = licenseConclusions.filter((lc) => {
                if (lc.local) {
                    return lc.contextPurl === purl;
                } else {
                    return true;
                }
            });

            const users = await getUsers();

            const lcs = licenseConclusions.map((lc) => {
                const username = users.find(
                    (u) => u.id === lc.userId,
                )?.username;
                if (!username) {
                    throw new CustomError(
                        "Internal server error: creator username not found",
                        500,
                    );
                }
                return {
                    ...lc,
                    user: {
                        username: username,
                    },
                };
            });

            res.status(200).json({
                licenseConclusions: lcs,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.post(
    "/packages/:purl/files/:sha256/license-conclusions",
    authzPermission({ resource: "ClearanceItems", scopes: ["POST"] }),
    async (req, res) => {
        try {
            const contextPurl = req.params.purl;

            // Make sure that a package with purl exists
            const packageId = await dbQueries.findPackageIdByPurl(contextPurl);

            if (!packageId)
                throw new CustomError(
                    "Package with specified purl not found",
                    404,
                    "purl",
                );

            // Make sure that a file with sha256 exists in package with purl
            const filetree =
                await dbQueries.findFiletreeByPackageIdAndFileSha256(
                    packageId,
                    req.params.sha256,
                );

            if (!filetree)
                throw new CustomError(
                    "File with specified sha256 does not exist in the specified context package",
                    400,
                    "sha256",
                );

            const licenseConclusion = await dbQueries.createLicenseConclusion({
                concludedLicenseExpressionSPDX:
                    req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX:
                    req.body.detectedLicenseExpressionSPDX || null,
                comment: req.body.comment || null,
                local: req.body.local,
                contextPurl: contextPurl,
                file: { connect: { sha256: req.params.sha256 } },
                userId: req.kauth.grant.access_token.content.sub,
            });

            res.status(200).json({
                licenseConclusionId: licenseConclusion.id,
                message: "License conclusion created",
            });
        } catch (error) {
            console.log("Error: ", error);

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025" &&
                error.message.includes("No User found")
            ) {
                return res.status(404).json({
                    message:
                        "User not found. This keycloak id does not have a corresponding user row in the user table.",
                });
            } else if (error instanceof CustomError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            } else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.put(
    "/license-conclusions/:id",
    // @ts-expect-error -  Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["PUT"] }),
    async (req, res) => {
        try {
            const licenseConclusionId = req.params.id;
            const licenseConclusion =
                await dbQueries.findLicenseConclusionById(licenseConclusionId);

            if (!licenseConclusion)
                throw new CustomError(
                    "License conclusion to update not found",
                    404,
                );

            // Make sure that the license conclusion belongs to the user or the user is admin
            if (
                !req.kauth.grant.access_token.content.realm_access.roles.includes(
                    "app-admin",
                ) &&
                req.kauth.grant.access_token.content.sub !==
                    licenseConclusion.userId
            )
                throw new CustomError("Forbidden", 403);

            await dbQueries.updateLicenseConclusion(licenseConclusionId, {
                concludedLicenseExpressionSPDX:
                    req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX:
                    req.body.detectedLicenseExpressionSPDX,
                comment: req.body.comment,
                local: req.body.local,
                contextPurl: undefined,
                /*
                 * The following will detach the license conclusion from a bulk conclusion if it is connected to one
                 * (since this endpoint is used to update one license conclusion only, and the bulk conclusion
                 * is updated through the PUT /bulk-conclusion/:id endpoint)
                 */

                bulkConclusionId: licenseConclusion.bulkConclusionId
                    ? null
                    : undefined,
            });

            res.status(200).json({ message: "License conclusion updated" });
        } catch (error) {
            console.log("Error: ", error);

            if (error instanceof CustomError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            } else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message: "License conclusion to update not found",
                });
            } else if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    },
);

userRouter.delete(
    "/license-conclusions/:id",
    // @ts-expect-error -  Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["DELETE"] }),
    async (req, res) => {
        try {
            const licenseConclusionId = req.params.id;
            const licenseConclusionUserId =
                await dbQueries.findLicenseConclusionUserId(
                    licenseConclusionId,
                );

            if (!licenseConclusionUserId)
                throw new CustomError(
                    "License conclusion to delete not found",
                    404,
                );

            // Make sure that the license conclusion belongs to the user or the user is admin
            if (
                !req.kauth.grant.access_token.content.realm_access.roles.includes(
                    "app-admin",
                ) &&
                req.kauth.grant.access_token.content.sub !==
                    licenseConclusionUserId
            )
                throw new CustomError("Forbidden", 403);

            await dbQueries.deleteLicenseConclusion(licenseConclusionId);

            res.status(200).json({ message: "License conclusion deleted" });
        } catch (error) {
            console.log("Error: ", error);

            if (error instanceof CustomError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            } else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message:
                        "License conclusion with the requested id does not exist",
                });
            } else if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    },
);

userRouter.get(
    "/bulk-conclusions",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const userIds = req.query.username
                ? await getUserIdArray(
                      req.query.username,
                      req.query.usernameStrict,
                  )
                : undefined;

            const pageSize = req.query.pageSize;
            const pageIndex = req.query.pageIndex;
            const skip = pageSize && pageIndex ? pageSize * pageIndex : 0;
            const bulkConclusions =
                await dbQueries.findBulkConclusionsWithRelations(
                    // If sortBy is "username", the pagination will have to be handled in-memory
                    req.query.sortBy !== "username" ? skip : undefined,
                    req.query.sortBy !== "username" ? pageSize : undefined,
                    // If sortBy and sortOrder are not provided, default to descending order by updatedAt
                    // If sortBy is "username", the sorting will have to be handled in-memory
                    req.query.sortBy !== "username"
                        ? req.query.sortBy || "updatedAt"
                        : undefined,
                    req.query.sortBy !== "username"
                        ? !req.query.sortBy && !req.query.sortOrder
                            ? "desc"
                            : req.query.sortOrder
                        : undefined,
                    req.query.purl,
                    req.query.purlStrict || false,
                    userIds,
                    req.query.pattern,
                    req.query.detectedLicense,
                    req.query.concludedLicense,
                    req.query.comment,
                    req.query.local,
                    req.query.createdAtGte,
                    req.query.createdAtLte,
                    req.query.updatedAtGte,
                    req.query.updatedAtLte,
                );

            // Get users from Keycloak server to be able to match user ids to usernames
            const users = await getUsers();

            // Add username to each bulk conclusion
            const bcsWithUsernames = bulkConclusions.map((bc) => {
                const username = users.find(
                    (u) => u.id === bc.userId,
                )?.username;
                if (!username) {
                    throw new CustomError(
                        "Internal server error: creator username not found",
                        500,
                    );
                }
                return {
                    ...bc,
                    user: {
                        username: username,
                    },
                };
            });

            let bcs = [...bcsWithUsernames];

            // Handle sorting and pagination in-memory if sortBy is "username"
            if (req.query.sortBy === "username") {
                // Sort by username
                bcs.sort((a, b) => {
                    if (a.user.username < b.user.username) return -1;
                    if (a.user.username > b.user.username) return 1;
                    return 0;
                });

                // Reverse the array if sortOrder is "desc"
                if (req.query.sortOrder === "desc") {
                    bcs.reverse();
                }

                // If pageSize is provided, slice the array
                if (pageSize) {
                    bcs = bcs.slice(skip, skip + pageSize);
                }
            }

            res.status(200).json({
                bulkConclusions: bcs,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/bulk-conclusions/count",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const userIds = req.query.username
                ? await getUserIdArray(
                      req.query.username,
                      req.query.usernameStrict,
                  )
                : undefined;

            const bulkConclusionsCount = await dbQueries.countBulkConclusions(
                req.query.purl,
                req.query.purlStrict || false,
                userIds,
                req.query.pattern,
                req.query.detectedLicense,
                req.query.concludedLicense,
                req.query.comment,
                req.query.local,
                req.query.createdAtGte,
                req.query.createdAtLte,
                req.query.updatedAtGte,
                req.query.updatedAtLte,
            );

            res.status(200).json({ count: bulkConclusionsCount });
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
);

userRouter.get(
    "/bulk-conclusions/:id/affected-files",
    // @ts-expect-error - Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const bulkConclusionId = req.params.id;

            const bulkConclusion =
                await dbQueries.findBulkConclusionById(bulkConclusionId);

            if (!bulkConclusion)
                throw new CustomError(
                    "Bulk conclusion with the requested id does not exist",
                    404,
                );

            let queryPkg: Package | null = null;
            if (req.query.purl) {
                queryPkg = await dbQueries.findPackageByPurl(req.query.purl);

                if (!queryPkg) {
                    throw new CustomError(
                        "Package with specified purl not found",
                        404,
                        "purl",
                    );
                }
            }

            const inContextPurl =
                await dbQueries.findFileTreesByBulkConclusionId(
                    bulkConclusionId,
                    bulkConclusion.package.id,
                );

            const additionalMatches = bulkConclusion.local
                ? []
                : await dbQueries.findFileTreesByBulkConclusionId(
                      bulkConclusionId,
                      undefined,
                      bulkConclusion.package.id,
                  );

            let inQueryPurl: dbQueries.FileTreeWithPackage[] = [];

            if (req.query.purl && queryPkg) {
                inQueryPurl = await dbQueries.findFileTreesByBulkConclusionId(
                    bulkConclusionId,
                    queryPkg.id,
                );
            }

            res.status(200).json({
                affectedFiles: {
                    inContextPurl: inContextPurl.map((ft) => ft.path),
                    additionalMatches: additionalMatches.map((ft) => {
                        return {
                            path: ft.path,
                            purl: ft.package.purl,
                        };
                    }),
                    inQueryPurl: inQueryPurl.map((ft) => ft.path),
                },
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/packages/:purl/bulk-conclusions",
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;

            const packageId = await dbQueries.findPackageIdByPurl(purl);

            if (!packageId)
                throw new CustomError(
                    "Package with purl " + purl + " not found",
                    404,
                );

            const bulkConclusions =
                await dbQueries.findBulkConclusionsWithRelationsByPackageId(
                    packageId,
                );

            const users = await getUsers();

            const bcs = bulkConclusions.map((bc) => {
                const username = users.find(
                    (u) => u.id === bc.userId,
                )?.username;

                if (!username) {
                    throw new CustomError(
                        "Internal server error: creator username not found",
                        500,
                    );
                }

                return {
                    ...bc,
                    user: {
                        username: username,
                    },
                };
            });

            res.status(200).json({
                bulkConclusions: bcs,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message:
                        "Package with purl " + req.params.purl + " not found",
                });
            } else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/packages/:purl/bulk-conclusions/count",
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;

            const packageId = await dbQueries.findPackageIdByPurl(purl);

            if (!packageId)
                throw new CustomError(
                    "Package with purl " + purl + " not found",
                    404,
                );

            const bulkConclusionsCount =
                await dbQueries.countBulkConclusionsForPackage(packageId);

            res.status(200).json({
                count: bulkConclusionsCount,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message:
                        "Package with purl " + req.params.purl + " not found",
                });
            } else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.post(
    "/packages/:purl/bulk-conclusions",
    authzPermission({ resource: "ClearanceItems", scopes: ["POST"] }),
    async (req, res) => {
        try {
            const contextPurl = req.params.purl;

            const packageId = await dbQueries.findPackageIdByPurl(contextPurl);

            if (!packageId)
                throw new CustomError(
                    "Bad request. No package with the provided purl was found",
                    400,
                );

            const pattern = req.body.pattern.trim();

            const bulkConclusion = await dbQueries.createBulkConclusion({
                pattern: pattern,
                concludedLicenseExpressionSPDX:
                    req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX:
                    req.body.detectedLicenseExpressionSPDX || null,
                comment: req.body.comment || null,
                local: req.body.local,
                package: { connect: { id: packageId } },
                userId: req.kauth.grant.access_token.content.sub,
            });

            const licenseConclusionInputs = [];

            const fileTrees = await findFileTreesMatchingPattern(
                packageId,
                pattern,
            );

            if (fileTrees.length === 0) {
                const deletedBulkConclusion =
                    await dbQueries.deleteBulkConclusion(bulkConclusion.id);
                if (!deletedBulkConclusion)
                    console.log(
                        "Unable to delete bulk conclusion id: " +
                            bulkConclusion.id,
                    );
                throw new CustomError(
                    "No matching files for the provided pattern were found in the package",
                    400,
                    "pattern",
                );
            }

            for (const fileTree of fileTrees) {
                // If licenseConclusionInputs doesn't already contain a license conclusion input for fileSha256 = fileTree.fileSha256
                if (
                    licenseConclusionInputs.find(
                        (lc) => lc.fileSha256 === fileTree.fileSha256,
                    ) === undefined
                )
                    licenseConclusionInputs.push({
                        concludedLicenseExpressionSPDX:
                            req.body.concludedLicenseExpressionSPDX,
                        detectedLicenseExpressionSPDX:
                            req.body.detectedLicenseExpressionSPDX || null,
                        comment: req.body.comment || null,
                        local: req.body.local,
                        contextPurl: contextPurl,
                        fileSha256: fileTree.fileSha256,
                        bulkConclusionId: bulkConclusion.id,
                        userId: req.kauth.grant.access_token.content.sub,
                    });
            }

            const batchCount = await dbQueries.createManyLicenseConclusions(
                licenseConclusionInputs,
            );

            if (batchCount.count !== licenseConclusionInputs.length) {
                const deletedBulkConclusion =
                    await dbQueries.deleteBulkConclusion(bulkConclusion.id);
                if (!deletedBulkConclusion)
                    console.log(
                        "Unable to delete bulk conclusion id: " +
                            bulkConclusion.id,
                    );
                throw new CustomError(
                    "Internal server error: Error creating license conclusions",
                    500,
                );
            }

            const affectedRecords =
                await dbQueries.bulkConclusionAffectedRecords(
                    bulkConclusion.id,
                    packageId,
                    req.body.local || false,
                );

            res.status(200).json({
                bulkConclusionId: bulkConclusion.id,
                matchedPathsCount: fileTrees.length,
                addedLicenseConclusionsCount: licenseConclusionInputs.length,
                affectedFilesInPackageCount:
                    affectedRecords.affectedPackageFileTreesCount,
                affectedFilesAcrossAllPackagesCount:
                    affectedRecords.affectedTotalFileTreesCount,
                message:
                    "Bulk conclusion created and license conclusions added",
            });
        } catch (error) {
            console.log("Error: ", error);

            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/bulk-conclusions/:id",
    // @ts-expect-error - Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const bulkConclusionId = req.params.id;

            const bulkConclusion =
                await dbQueries.findBulkConclusionById(bulkConclusionId);

            if (!bulkConclusion)
                throw new CustomError(
                    "Bulk conclusion with the requested id does not exist",
                    404,
                );

            const bulkConclusionWithRelations =
                await dbQueries.findBulkConclusionWithRelationsById(
                    bulkConclusionId,
                    bulkConclusion.package.id,
                );

            if (!bulkConclusionWithRelations)
                throw new CustomError("Bulk conclusion not found", 404);

            const filepaths = [];
            const licenseConclusions = [];

            for (const lc of bulkConclusionWithRelations.licenseConclusions) {
                for (const filetree of lc.file.filetrees) {
                    filepaths.push(filetree.path);
                }
                licenseConclusions.push({ id: lc.id });
            }

            res.status(200).json({
                pattern: bulkConclusion.pattern,
                concludedLicenseExpressionSPDX:
                    bulkConclusion.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX:
                    bulkConclusion.detectedLicenseExpressionSPDX,
                comment: bulkConclusion.comment,
                local: bulkConclusion.local,
                filePaths: filepaths,
                licenseConclusions: licenseConclusions,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message:
                        "Bulk conclusion with the requested id does not exist",
                });
            } else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.put(
    "/bulk-conclusions/:id",
    // @ts-expect-error -  Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["PUT"] }),
    async (req, res) => {
        try {
            const bulkConclusionId = req.params.id;

            const origBulk =
                await dbQueries.findBCWithRelatedLCsById(bulkConclusionId);

            if (!origBulk)
                throw new CustomError(
                    "Bulk conclusion to update not found",
                    404,
                );

            if (
                !req.kauth.grant.access_token.content.realm_access.roles.includes(
                    "app-admin",
                ) &&
                req.kauth.grant.access_token.content.sub !== origBulk.userId
            ) {
                throw new CustomError("Forbidden", 403);
            }

            const reqPattern = req.body.pattern;
            const reqCLESPDX = req.body.concludedLicenseExpressionSPDX;
            const reqDLESPDX = req.body.detectedLicenseExpressionSPDX;
            const reqComment = req.body.comment;
            const reqLocal = req.body.local;

            if (
                !reqPattern &&
                !reqCLESPDX &&
                !reqDLESPDX &&
                reqComment === undefined &&
                reqLocal === undefined
            ) {
                throw new CustomError(
                    "At least one field is required",
                    400,
                    "root",
                );
            }

            if (
                (!reqPattern || reqPattern === origBulk.pattern) &&
                (!reqCLESPDX ||
                    reqCLESPDX === origBulk.concludedLicenseExpressionSPDX) &&
                (!reqDLESPDX ||
                    reqDLESPDX === origBulk.detectedLicenseExpressionSPDX) &&
                (reqComment === undefined || reqComment === origBulk.comment) &&
                (reqLocal === undefined || reqLocal === origBulk.local)
            ) {
                throw new CustomError("Nothing to update", 400, "root");
            }

            // List of new license conclusions to add
            const newInputs: Prisma.LicenseConclusionCreateManyInput[] = [];

            // List of ids of license conclusions to delete
            const delLCs: number[] = [];

            if (reqPattern && reqPattern !== origBulk.pattern) {
                const fileTrees = await findFileTreesMatchingPattern(
                    origBulk.package.id,
                    reqPattern,
                );

                if (fileTrees.length === 0) {
                    throw new CustomError(
                        "No matching files for the provided pattern were found in the package",
                        400,
                        "pattern",
                    );
                }

                // Find new matching files and add them to newInputs
                for (const fileTree of fileTrees) {
                    if (
                        origBulk.licenseConclusions.find(
                            (lc) => lc.fileSha256 === fileTree.fileSha256,
                        ) === undefined &&
                        newInputs.find(
                            (lc) => lc.fileSha256 === fileTree.fileSha256,
                        ) === undefined
                    ) {
                        newInputs.push({
                            concludedLicenseExpressionSPDX:
                                reqCLESPDX ||
                                origBulk.concludedLicenseExpressionSPDX,
                            detectedLicenseExpressionSPDX:
                                reqDLESPDX ||
                                origBulk.detectedLicenseExpressionSPDX,
                            comment: reqComment || origBulk.comment,
                            local:
                                reqLocal !== undefined
                                    ? reqLocal
                                    : origBulk.local,
                            contextPurl: origBulk.package.purl,
                            fileSha256: fileTree.fileSha256,
                            bulkConclusionId: origBulk.id,
                            userId: req.kauth.grant.access_token.content.sub,
                        });
                    }
                }

                // Find license conclusions that no longer match the pattern and add them to delLCs
                for (const lc of origBulk.licenseConclusions) {
                    if (
                        fileTrees.find(
                            (ft) => ft.fileSha256 === lc.fileSha256,
                        ) === undefined
                    ) {
                        delLCs.push(lc.id);
                    }
                }
            }

            // Use transaction to update bulk conclusion and related license conclusions
            await dbQueries.updateBCAndRelatedLCsTA(
                bulkConclusionId,
                newInputs,
                delLCs,
                {
                    pattern: reqPattern,
                    concludedLicenseExpressionSPDX: reqCLESPDX,
                    detectedLicenseExpressionSPDX: reqDLESPDX,
                    comment: reqComment,
                    local: reqLocal,
                },
            );

            res.status(200).json({ message: "Bulk conclusion updated" });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message: "Bulk conclusion to update not found",
                });
            } else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.delete(
    "/bulk-conclusions/:id",
    // @ts-expect-error -  Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["DELETE"] }),
    async (req, res) => {
        try {
            const bulkConclusionId = req.params.id;

            const bulkConclusionUserId =
                await dbQueries.findBulkConclusionUserId(bulkConclusionId);

            if (!bulkConclusionUserId) {
                throw new CustomError(
                    "Bulk conclusion to delete not found",
                    404,
                );
            }

            if (
                !req.kauth.grant.access_token.content.realm_access.roles.includes(
                    "app-admin",
                ) &&
                req.kauth.grant.access_token.content.sub !==
                    bulkConclusionUserId
            ) {
                throw new CustomError("Forbidden", 403);
            }

            await dbQueries.deleteBulkAndLicenseConclusions(bulkConclusionId);

            res.status(200).json({ message: "Bulk conclusion deleted" });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message: "Bulk conclusion to delete not found",
                });
            } else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/path-exclusions",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const userIds = req.query.username
                ? await getUserIdArray(
                      req.query.username,
                      req.query.usernameStrict,
                  )
                : undefined;

            const pageSize = req.query.pageSize;
            const pageIndex = req.query.pageIndex;
            const skip = pageSize && pageIndex ? pageSize * pageIndex : 0;
            const pathExclusions = await dbQueries.findPathExclusions(
                // If sortBy is "username", the pagination will have to be handled in-memory
                req.query.sortBy !== "username" ? skip : undefined,
                req.query.sortBy !== "username" ? pageSize : undefined,
                // If sortBy and sortOrder are not provided, default to descending order by updatedAt
                // If sortBy is "username", the sorting will have to be handled in-memory
                req.query.sortBy !== "username"
                    ? req.query.sortBy || "updatedAt"
                    : undefined,
                req.query.sortBy !== "username"
                    ? !req.query.sortBy && !req.query.sortOrder
                        ? "desc"
                        : req.query.sortOrder
                    : undefined,
                req.query.purl,
                req.query.purlStrict || false,
                userIds,
                req.query.pattern,
                req.query.reason,
                req.query.comment,
                req.query.createdAtGte,
                req.query.createdAtLte,
                req.query.updatedAtGte,
                req.query.updatedAtLte,
            );

            // Get users from Keycloak server to be able to match user ids to usernames
            const users = await getUsers();

            const pesWithUsernames = pathExclusions.map((pe) => {
                const username = users.find(
                    (u) => u.id === pe.userId,
                )?.username;
                if (!username) {
                    throw new CustomError(
                        "Internal server error: creator username not found",
                        500,
                    );
                }
                return {
                    ...pe,
                    user: {
                        username: username,
                    },
                };
            });

            let pes = [...pesWithUsernames];

            // Handle sorting and pagination in-memory if sortBy is "username"
            if (req.query.sortBy === "username") {
                // Sort by username
                pes.sort((a, b) => {
                    if (a.user.username < b.user.username) return -1;
                    if (a.user.username > b.user.username) return 1;
                    return 0;
                });

                // Reverse the array if sortOrder is "desc"
                if (req.query.sortOrder === "desc") {
                    pes.reverse();
                }

                // If pageSize is provided, slice the array
                if (pageSize) {
                    pes = pes.slice(skip, skip + pageSize);
                }
            }

            return res.status(200).json({
                pathExclusions: pes,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/path-exclusions/count",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const userIds = req.query.username
                ? await getUserIdArray(
                      req.query.username,
                      req.query.usernameStrict,
                  )
                : undefined;

            const pathExclusionsCount = await dbQueries.countPathExclusions(
                req.query.purl,
                req.query.purlStrict || false,
                userIds,
                req.query.pattern,
                req.query.reason,
                req.query.comment,
                req.query.createdAtGte,
                req.query.createdAtLte,
                req.query.updatedAtGte,
                req.query.updatedAtLte,
            );

            res.status(200).json({
                count: pathExclusionsCount,
            });
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
);

userRouter.get(
    "/path-exclusions/:id/affected-files",
    // @ts-expect-error - Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const pe = await dbQueries.findPathExclusionById(req.params.id);

            if (!pe)
                throw new CustomError(
                    "Path exclusion with the requested id does not exist",
                    404,
                );

            const filetrees = await findFileTreesMatchingPattern(
                pe.packageId,
                pe.pattern,
            );

            res.status(200).json({
                affectedFiles: filetrees.map((ft) => ft.path),
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/packages/:purl/path-exclusions",
    authzPermission({ resource: "ClearanceItems", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;

            const pathExclusions =
                await dbQueries.getPathExclusionsByPackagePurl(purl);

            const users = await getUsers();

            const pes = pathExclusions.map((pe) => {
                const username = users.find(
                    (u) => u.id === pe.userId,
                )?.username;
                if (!username) {
                    throw new CustomError(
                        "Internal server error: creator username not found",
                        500,
                    );
                }
                return {
                    ...pe,
                    user: {
                        username: username,
                    },
                };
            });

            res.status(200).json({
                pathExclusions: pes,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message: "Package with the requested purl does not exist",
                });
            } else if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    },
);

userRouter.post(
    "/packages/:purl/path-exclusions",
    authzPermission({ resource: "ClearanceItems", scopes: ["POST"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;
            const packageId = await dbQueries.findPackageIdByPurl(purl);

            if (!packageId) throw new CustomError("Package not found", 404);

            // Check that at least one file with a matching path to the glob pattern exists for the package
            const matchFound = await fileTreeMatchingPatternExists(
                packageId,
                req.body.pattern.trim(),
            );

            if (!matchFound)
                throw new CustomError(
                    "No matching path(s) for the provided pattern were found in the package",
                    400,
                    "pattern",
                );

            const pathExclusion = await dbQueries.createPathExclusion({
                pattern: req.body.pattern,
                reason: req.body.reason,
                comment: req.body.comment || null,
                package: { connect: { id: packageId } },
                userId: req.kauth.grant.access_token.content.sub,
            });

            res.status(200).json({
                pathExclusionId: pathExclusion.id,
                message: "Path exclusion created",
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.put(
    "/path-exclusions/:id",
    // @ts-expect-error -  Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["PUT"] }),
    async (req, res) => {
        try {
            const pathExclusion = await dbQueries.findPathExclusionById(
                req.params.id,
            );

            if (!pathExclusion)
                throw new CustomError(
                    "Path exclusion to update not found",
                    404,
                );

            if (
                !req.kauth.grant.access_token.content.realm_access.roles.includes(
                    "app-admin",
                ) &&
                req.kauth.grant.access_token.content.sub !==
                    pathExclusion.userId
            ) {
                throw new CustomError("Forbidden", 403);
            }

            const reqPattern = req.body.pattern;
            const reqReason = req.body.reason;
            const reqComment = req.body.comment;

            if (
                (!reqPattern || reqPattern === pathExclusion.pattern) &&
                (!reqReason || reqReason === pathExclusion.reason) &&
                (!reqComment || reqComment === pathExclusion.comment)
            ) {
                throw new CustomError("Nothing to update", 400, "root");
            }

            const pkg = await dbQueries.findPackageById(
                pathExclusion.packageId,
            );
            if (!pkg) throw new CustomError("Package not found", 404);

            if (reqPattern && reqPattern !== pathExclusion.pattern) {
                // Check that at least one file with a matching path to the glob pattern exists for the package
                const matchFound = await fileTreeMatchingPatternExists(
                    pathExclusion.packageId,
                    reqPattern,
                );

                if (!matchFound)
                    throw new CustomError(
                        "No matching path(s) for the provided pattern were found in the package",
                        400,
                        "pattern",
                    );
            }

            const updatedPathExclusion = await dbQueries.updatePathExclusion(
                pathExclusion.id,
                {
                    pattern: reqPattern,
                    reason: reqReason,
                    comment: reqComment,
                },
            );

            if (!updatedPathExclusion)
                throw new CustomError(
                    "Internal Server Error: Unable to update path exclusion",
                    500,
                );

            res.status(200).json({ message: "Path exclusion updated" });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            else {
                // If error is not a CustomError, it is a Prisma error or an unknown error
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.delete(
    "/path-exclusions/:id",
    // @ts-expect-error -  Types of property 'params' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "ClearanceItems", scopes: ["DELETE"] }),
    async (req, res) => {
        try {
            const pathExclusionId = req.params.id;

            const pathExclusionUserId =
                await dbQueries.findPathExclusionUserId(pathExclusionId);

            if (!pathExclusionUserId)
                throw new CustomError(
                    "Path exclusion to delete not found",
                    404,
                );

            // Make sure that the path exclusion belongs to the user or the user is admin
            if (
                !req.kauth.grant.access_token.content.realm_access.roles.includes(
                    "app-admin",
                ) &&
                req.kauth.grant.access_token.content.sub !== pathExclusionUserId
            ) {
                throw new CustomError("Forbidden", 403);
            }

            await dbQueries.deletePathExclusion(pathExclusionId);

            res.status(200).json({ message: "Path exclusion deleted" });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, path: error.path });
            } else if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                return res.status(404).json({
                    message:
                        "Path exclusion with the requested id does not exist",
                });
            } else if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    },
);

userRouter.get(
    "/packages/:purl",
    authzPermission({ resource: "PackageData", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;
            const pkg = await dbQueries.findPackageByPurl(purl);

            if (!pkg) throw new CustomError("Package not found", 404);

            res.status(200).json({
                declaredLicenseSPDX: pkg.declaredLicenseSPDX,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/packages/:purl/filetrees",
    authzPermission({ resource: "PackageData", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;
            const pkg = await dbQueries.findPackageByPurl(purl);

            if (!pkg) throw new CustomError("Package not found", 404);

            const filetrees = await dbQueries.findFileTreeDataByPackageId(
                pkg.id,
            );

            res.status(200).json({
                filetrees: filetrees,
            });
        } catch (error) {
            console.log("Error: ", error);
            // Get error status code and message based on whether error is a Prisma error or an unknown error
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    },
);

userRouter.get(
    "/packages/:purl/filetrees/:path/files",
    authzPermission({ resource: "PackageData", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;
            const path = req.params.path;

            const file = await dbQueries.findFileSha256AndScannerByPurlAndPath(
                purl,
                path,
            );

            if (!file) throw new CustomError("File not found", 400);

            const presignedGetUrl = await getPresignedGetUrl(
                s3Client,
                process.env.SPACES_BUCKET || "doubleopen",
                file.sha256,
            );

            if (!presignedGetUrl) {
                throw new CustomError(
                    "Internal server error: Presigned URL is undefined",
                    500,
                );
            }

            res.status(200).json({
                sha256: file.sha256,
                downloadUrl: presignedGetUrl,
                scanner: file.scanner,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/packages/:purl/license-findings",
    authzPermission({ resource: "PackageData", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const purl = req.params.purl;
            const pkg = await dbQueries.findPackageByPurl(purl);

            if (!pkg) throw new CustomError("Package not found", 404);

            const licenseFindings =
                await dbQueries.findLicenseFindingsByPackageId(pkg.id);

            res.status(200).json({
                licenseFindings: licenseFindings,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

userRouter.get(
    "/files/:sha256/license-findings",
    authzPermission({ resource: "PackageData", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const sha256 = req.params.sha256;
            const file = await dbQueries.findFileByHash(sha256);

            if (!file)
                throw new CustomError(
                    "File with the requested sha256 does not exist",
                    400,
                );

            const licenseFindings =
                await dbQueries.findLicenseFindingsByFileSha256(sha256);

            res.status(200).json({
                licenseFindings: licenseFindings,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError)
                return res
                    .status(error.statusCode)
                    .json({ message: error.message });
            else {
                const err = await getErrorCodeAndMessage(error);
                res.status(err.statusCode).json({ message: err.message });
            }
        }
    },
);

export default userRouter;
