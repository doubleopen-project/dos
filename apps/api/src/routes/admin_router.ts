// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
import { zodiosRouter } from "@zodios/express";
import { Prisma } from "database";
import { adminAPI } from "validation-helpers";
import { CustomError } from "../helpers/custom_error";
import * as dbOperations from "../helpers/db_operations";
import {
    countScannedPackages,
    findScannedPackages,
    getDistinctUserIdsForItems,
} from "../helpers/db_queries";
import { getErrorCodeAndMessage } from "../helpers/error_handling";
import {
    addRealmRolesToUser,
    createUser,
    deleteUser,
    getUsers,
} from "../helpers/keycloak_queries";
import { runPurlCleanup } from "../helpers/purl_cleanup_helpers";
import { authzPermission } from "../middlewares/authz_permission";

const adminRouter = zodiosRouter(adminAPI);

// ----------------------------------- ADMIN ROUTES -----------------------------------

adminRouter.post(
    "/users",
    authzPermission({ resource: "Users", scopes: ["POST"] }),
    async (req, res) => {
        try {
            const { username, password } = req.body;
            const role = req.body.role ? req.body.role : "USER";
            const realmRoles =
                role === "USER" ? ["app-user"] : ["app-user", "app-admin"];
            const dosApiToken =
                req.body.dosApiToken || crypto.randomBytes(16).toString("hex");

            const newUser = await createUser({
                username,
                credentials: [
                    {
                        type: "password",
                        value: password,
                        temporary:
                            req.body.passwordIsTemporary !== undefined
                                ? req.body.passwordIsTemporary
                                : true,
                    },
                ],
                attributes: {
                    dosApiToken: dosApiToken,
                },
                enabled: true,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                emailVerified: req.body.emailVerified || false,
            });

            await addRealmRolesToUser(newUser.id, realmRoles);

            res.status(200).send({
                id: newUser.id,
                username: newUser.username,
                dosApiToken: dosApiToken,
                realmRoles: realmRoles,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                requiredActions: newUser.requiredActions,
            });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({
                    message: error.message,
                    path: error.path,
                });
            } else {
                res.status(500).send({
                    message: "Internal server error: Unknown error",
                });
            }
        }
    },
);

// Delete user by id
adminRouter.delete(
    "/users/:id",
    authzPermission({ resource: "Users", scopes: ["DELETE"] }),
    async (req, res) => {
        try {
            if (req.params.id === req.kauth.grant.access_token.content.sub)
                throw new CustomError(
                    "Cannot delete the user making this request",
                    400,
                    "id",
                );

            const deletedUser = await deleteUser(req.params.id);

            if (deletedUser) res.status(200).json({ message: "User deleted" });
            else res.status(400).json({ message: "User to delete not found" });
        } catch (error) {
            console.log("Error: ", error);
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({
                    message: error.message,
                    path: error.path,
                });
            } else {
                res.status(500).json({
                    message: "Internal server error: Unknown error",
                });
            }
        }
    },
);

// Delete scan results for a specified package purl
adminRouter.delete(
    "/scan-results",
    authzPermission({ resource: "PackageData", scopes: ["DELETE"] }),
    async (req, res) => {
        try {
            const message = await dbOperations.deletePackageDataByPurl(
                req.body.purl,
            );
            res.status(200).json({ message: message });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                res.status(404).json({
                    message: "Package or items to delete not found",
                });
            console.log("Error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
);

adminRouter.post(
    "/purl-cleanup",
    authzPermission({ resource: "Maintenance", scopes: ["POST"] }),
    async (req, res) => {
        try {
            const optionDescriptions = {
                dryRun: "Defaults to true. The cleanup is run as a dry run to see what would happen without actually making any update queries to the database. Set to false to enable the database update queries. You can run any of the phases below with the dryRun option enabled.",
                pkgNameStartsWith:
                    "Set this to a string to run the cleanup only for packages where name starts with the given string.",
                allPhases:
                    "Set this to true to run all the phases described below. Note that if this option is enabled, the other options below will be ignored.",
                transferPathExclusions:
                    "Set this to true to transfer path exclusions from old packages to the newest package",
                transferBulkConclusions:
                    "Set this to true to transfer bulk conclusions from old packages to the newest package",
                changeContextPurls:
                    "Set this to true to change the context purl of license conclusions from old purl bookmark to the new one",
                deleteOldPurlBookmarks:
                    "Set this to true to delete old purl bookmarks",
            };
            if (
                !req.body.options ||
                Object.keys(req.body.options).length === 0
            ) {
                res.status(200).json({
                    message:
                        "No options chosen. You can use the options described in optionDescriptions (true/false/undefined). Note that the dryRun option is enabled by default, and needs to be set to false in order to enable database update queries.",
                    optionDescriptions: optionDescriptions,
                });
            } else {
                console.log("Triggering purl bookmark cleanup");

                runPurlCleanup(req.body.options);

                res.status(200).json({
                    message: "Triggered purl bookmark cleanup",
                    optionDescriptions: optionDescriptions,
                });
            }
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
);

adminRouter.get(
    "/packages",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "PackageLibraryData", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const pageSize = req.query.pageSize;
            const pageIndex = req.query.pageIndex;
            const skip = pageSize && pageIndex ? pageSize * pageIndex : 0;

            const packages = await findScannedPackages(
                skip,
                pageSize,
                // If sortBy and sortOrder are not provided, default to descending order by updatedAt
                req.query.sortBy || "updatedAt",
                !req.query.sortBy && !req.query.sortOrder
                    ? "desc"
                    : req.query.sortOrder,
                req.query.name,
                req.query.version,
                req.query.type,
                req.query.namespace,
                req.query.purl,
                req.query.createdAtGte,
                req.query.createdAtLte,
                req.query.updatedAtGte,
                req.query.updatedAtLte,
            );

            res.status(200).json({ packages: packages });
        } catch (error) {
            console.log("Error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
);

adminRouter.get(
    "/packages/count",
    // @ts-expect-error - Types of property 'query' are incompatible. This error does not affect the functionality of the code.
    authzPermission({ resource: "PackageLibraryData", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const count = await countScannedPackages(
                req.query.name,
                req.query.version,
                req.query.type,
                req.query.namespace,
                req.query.purl,
                req.query.createdAtGte,
                req.query.createdAtLte,
                req.query.updatedAtGte,
                req.query.updatedAtLte,
            );
            res.status(200).json({ count: count });
        } catch (error) {
            console.log("Error: ", error);
            // Find out if error is a Prisma error or an unknown error
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    },
);

adminRouter.get(
    "/clearance-items/distinct-users",
    authzPermission({ resource: "Users", scopes: ["GET"] }),
    async (req, res) => {
        try {
            const distinctUserIds = await getDistinctUserIdsForItems();
            const users = await getUsers();

            const distinctUsers = Array.from(distinctUserIds).map((userId) => ({
                id: userId,
                username: users.find((user) => user.id === userId)?.username,
            }));

            res.status(200).json({ users: distinctUsers });
        } catch (error) {
            console.log("Error: ", error);
            // Find out if error is a Prisma error or an unknown error
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    },
);

export default adminRouter;
