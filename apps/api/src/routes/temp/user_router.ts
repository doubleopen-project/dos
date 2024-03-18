// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
import { zodiosRouter } from "@zodios/express";
import { userAPI } from "validation-helpers";
import { CustomError } from "../../helpers/custom_error";
import { getErrorCodeAndMessage } from "../../helpers/error_handling";
import { getUsers, updateUser } from "../../helpers/keycloak_queries";
import * as dbQueries from "../../helpers/temp/db_queries";

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

userRouter.put("/token", async (req, res) => {
    try {
        const token = crypto.randomBytes(16).toString("hex");

        // Update user token
        await updateUser(req.kauth.grant.access_token.content.sub, {
            attributes: { dosApiToken: token },
        });

        res.status(200).json({ token: token });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const getUserIdArray = async (username: string, usernameStrict?: boolean) => {
    let userIds: string[] = [];

    if (usernameStrict) {
        const matchingUsers = await getUsers(username, undefined, true);
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

userRouter.get("/license-conclusions", async (req, res) => {
    try {
        // TODO: return only license conclusions that belong to the user
        // or to a group that the user belongs to

        const userIds = req.query.username
            ? await getUserIdArray(req.query.username, req.query.usernameStrict)
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
        const users = await getUsers();

        const licenseConclusionsWithRelations =
            await dbQueries.findLicenseConclusions(
                skip,
                pageSize,
                // If sortBy and sortOrder are not provided, default to descending order by updatedAt
                req.query.sortBy || "updatedAt",
                !req.query.sortBy && !req.query.sortOrder
                    ? "desc"
                    : req.query.sortOrder,
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

        const licenseConclusions = [];

        for (const lc of licenseConclusionsWithRelations) {
            const inContextPurl = [];
            const additionalMatches = [];
            const inQueryPurl = [];

            for (const ft of lc.file.filetrees) {
                if (ft.package.purl === lc.contextPurl) {
                    inContextPurl.push({
                        path: ft.path,
                    });
                } else {
                    if (!lc.local) {
                        additionalMatches.push({
                            path: ft.path,
                            purl: ft.package.purl,
                        });
                    }
                }
                if (ft.package.purl === req.query.purl) {
                    inQueryPurl.push({
                        path: ft.path,
                    });
                }
            }

            const username = users.find((u) => u.id === lc.kcUserId)?.username;

            if (!username) {
                throw new CustomError(
                    "Internal server error: creator username not found",
                    500,
                );
            }

            licenseConclusions.push({
                id: lc.id,
                updatedAt: lc.updatedAt,
                concludedLicenseExpressionSPDX:
                    lc.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX: lc.detectedLicenseExpressionSPDX,
                comment: lc.comment,
                local: lc.local,
                user: {
                    username: username,
                },
                bulkConclusionId: lc.bulkConclusionId,
                sha256: lc.file.sha256,
                contextPurl: lc.contextPurl,
                affectedPaths: {
                    inContextPurl: inContextPurl,
                    additionalMatches: additionalMatches,
                    inQueryPurl: inQueryPurl,
                },
            });
        }

        res.status(200).json({
            licenseConclusions: licenseConclusions,
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
});

userRouter.get("/license-conclusions/count", async (req, res) => {
    try {
        const userIds = req.query.username
            ? await getUserIdArray(req.query.username, req.query.usernameStrict)
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

        const licenseConclusionsCount = await dbQueries.countLicenseConclusions(
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
});

export default userRouter;
