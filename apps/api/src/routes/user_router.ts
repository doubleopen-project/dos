// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
import { zodiosRouter } from "@zodios/express";
import { Prisma } from "database";
import isGlob from "is-glob";
import { minimatch } from "minimatch";
import { getPresignedGetUrl } from "s3-helpers";
import { userAPI } from "validation-helpers";
import { CustomError } from "../helpers/custom_error";
import * as dbQueries from "../helpers/db_queries";
import { getErrorCodeAndMessage } from "../helpers/error_handling";
import { hashPassword } from "../helpers/password_helper";
import { s3Client } from "../helpers/s3client";

const userRouter = zodiosRouter(userAPI);

// ----------------------------------- USER ROUTES -----------------------------------

userRouter.get("/user", async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            res.status(401).send({ message: "Unauthorized" });
        } else {
            res.status(200).send({
                username: user.username,
                role: user.role,
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

userRouter.put("/user", async (req, res) => {
    try {
        const { user } = req;

        if (!user) throw new Error("User not found");

        if (!req.body.username && !req.body.password)
            throw new Error("At least one field is required");

        let pw: { hashedPassword: Buffer; salt: Buffer } | null = null;

        if (req.body.password) {
            pw = await hashPassword(req.body.password);

            await dbQueries.updateUser(user.id, {
                username: req.body.username,
                hashedPassword: pw.hashedPassword,
                salt: pw.salt,
            });
        } else {
            if (req.body.username !== user.username) {
                await dbQueries.updateUser(user.id, {
                    username: req.body.username,
                });
            } else {
                throw new Error("Nothing to update");
            }
        }
        res.status(200).send({ message: "User updated" });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return res
                .status(400)
                .json({ message: "Username already exists", path: "username" });
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
        const { user } = req;

        if (!user) throw new Error("User not found");

        const token = crypto.randomBytes(16).toString("hex");

        // Update user token
        await dbQueries.updateUser(user.id, { token: token });

        res.status(200).json({ token: token });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.get("/license-conclusions", async (req, res) => {
    try {
        // TODO: return only license conclusions that belong to the user
        // or to a group that the user belongs to

        const licenseConclusionsWithRelations =
            await dbQueries.findAllLicenseConclusions();

        const licenseConclusions = [];

        for (const lc of licenseConclusionsWithRelations) {
            const inContextPurl = [];
            const additionalMatches = [];

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
            }

            licenseConclusions.push({
                id: lc.id,
                updatedAt: lc.updatedAt,
                concludedLicenseExpressionSPDX:
                    lc.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX: lc.detectedLicenseExpressionSPDX,
                comment: lc.comment,
                local: lc.local,
                user: lc.user,
                bulkConclusionId: lc.bulkConclusionId,
                sha256: lc.file.sha256,
                contextPurl: lc.contextPurl,
                affectedPaths: {
                    inContextPurl: inContextPurl,
                    additionalMatches: additionalMatches,
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

userRouter.get(
    "/packages/:purl/files/:sha256/license-conclusions/",
    async (req, res) => {
        try {
            const fileSha256 = req.params.sha256;
            const purl = req.params.purl.replace(/%2F/g, "/");

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
    },
);

userRouter.post(
    "/packages/:purl/files/:sha256/license-conclusions",
    async (req, res) => {
        try {
            if (!req.user) throw new CustomError("Unauthorized", 401);

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
                fileSha256: req.params.sha256,
                userId: req.user.id,
            });

            res.status(200).json({
                licenseConclusionId: licenseConclusion.id,
                message: "License conclusion created",
            });
        } catch (error) {
            console.log("Error: ", error);

            if (error instanceof CustomError) {
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

userRouter.put("/license-conclusions/:id", async (req, res) => {
    try {
        if (!req.user) throw new Error("User not found");

        const licenseConclusionId = req.params.id;
        const licenseConclusion =
            await dbQueries.findLicenseConclusionById(licenseConclusionId);

        if (!licenseConclusion)
            throw new Error("License conclusion to update not found");

        // Make sure that the license conclusion belongs to the user or the user is admin
        if (
            req.user.role === "ADMIN" ||
            req.user.id === licenseConclusion.userId
        ) {
            await dbQueries.updateLicenseConclusion(licenseConclusionId, {
                concludedLicenseExpressionSPDX:
                    req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX:
                    req.body.detectedLicenseExpressionSPDX,
                comment: req.body.comment,
                local: req.body.local,
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
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.log("Error: ", error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res
                .status(404)
                .json({ message: "License conclusion to update not found" });
        } else if (error instanceof Error) {
            return res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

userRouter.delete("/license-conclusions/:id", async (req, res) => {
    try {
        if (!req.user) throw new Error("User not found");

        const licenseConclusionId = req.params.id;
        const licenseConclusionUserId =
            await dbQueries.findLicenseConclusionUserId(licenseConclusionId);

        if (!licenseConclusionUserId)
            throw new Error("License conclusion to delete not found");

        // Make sure that the license conclusion belongs to the user or the user is admin
        if (
            req.user.role === "ADMIN" ||
            req.user.id === licenseConclusionUserId
        ) {
            await dbQueries.deleteLicenseConclusion(licenseConclusionId);

            res.status(200).json({ message: "License conclusion deleted" });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.log("Error: ", error);

        if (
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
});

userRouter.get("/bulk-conclusions", async (req, res) => {
    try {
        const bulkConclusionsWithRelations =
            await dbQueries.findBulkConclusionsWithRelations();
        const bulkConclusions = [];

        for (const bc of bulkConclusionsWithRelations) {
            const licenseConclusions = [];

            for (const lc of bc.licenseConclusions) {
                const inContextPurl = [];
                const additionalMatches = [];

                for (const ft of lc.file.filetrees) {
                    if (ft.package.purl === bc.package.purl) {
                        inContextPurl.push(ft.path);
                    } else if (!bc.local) {
                        additionalMatches.push({
                            path: ft.path,
                            purl: ft.package.purl,
                        });
                    }
                }

                licenseConclusions.push({
                    id: lc.id,
                    sha256: lc.file.sha256,
                    affectedPaths: {
                        inContextPurl: inContextPurl,
                        additionalMatches: additionalMatches,
                    },
                });
            }

            bulkConclusions.push({
                id: bc.id,
                updatedAt: bc.updatedAt,
                pattern: bc.pattern,
                concludedLicenseExpressionSPDX:
                    bc.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX: bc.detectedLicenseExpressionSPDX,
                comment: bc.comment,
                contextPurl: bc.package.purl,
                local: bc.local,
                user: bc.user,
                licenseConclusions: licenseConclusions,
            });
        }

        res.status(200).json({
            bulkConclusions: bulkConclusions,
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

userRouter.post("/packages/:purl/bulk-conclusions", async (req, res) => {
    try {
        const { user } = req;

        if (!user) throw new CustomError("Unauthorized", 401);

        const contextPurl = req.params.purl;

        const packageId = await dbQueries.findPackageIdByPurl(contextPurl);

        if (!packageId)
            throw new CustomError(
                "Bad request. No package with the provided purl was found",
                400,
            );

        const licenseConclusionInputs = [];

        const fileTrees = await dbQueries.findFileTreesByPackageId(packageId);

        const pattern = req.body.pattern.trim();

        const bulkConclusion = await dbQueries.createBulkConclusion({
            pattern: pattern,
            concludedLicenseExpressionSPDX:
                req.body.concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX:
                req.body.detectedLicenseExpressionSPDX || null,
            comment: req.body.comment || null,
            local: req.body.local,
            packageId: packageId,
            userId: user.id,
        });

        let mathchedPathsCount = 0;

        for (const fileTree of fileTrees) {
            if (minimatch(fileTree.path, pattern, { dot: true })) {
                mathchedPathsCount++;
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
                        userId: user.id,
                        bulkConclusionId: bulkConclusion.id,
                    });
            }
        }

        if (licenseConclusionInputs.length === 0) {
            const deletedBulkConclusion = await dbQueries.deleteBulkConclusion(
                bulkConclusion.id,
            );
            if (!deletedBulkConclusion)
                console.log(
                    "Unable to delete bulk conclusion id: " + bulkConclusion.id,
                );
            throw new CustomError(
                "No matching files for the provided pattern were found in the package",
                400,
                "pattern",
            );
        }

        const batchCount = await dbQueries.createManyLicenseConclusions(
            licenseConclusionInputs,
        );

        if (batchCount.count !== licenseConclusionInputs.length) {
            const deletedBulkConclusion = await dbQueries.deleteBulkConclusion(
                bulkConclusion.id,
            );
            if (!deletedBulkConclusion)
                console.log(
                    "Unable to delete bulk conclusion id: " + bulkConclusion.id,
                );
            throw new CustomError(
                "Internal server error: Error creating license conclusions",
                500,
            );
        }

        const affectedRecords = await dbQueries.bulkConclusionAffectedRecords(
            bulkConclusion.id,
            packageId,
            req.body.local || false,
        );

        res.status(200).json({
            bulkConclusionId: bulkConclusion.id,
            matchedPathsCount: mathchedPathsCount,
            addedLicenseConclusionsCount: licenseConclusionInputs.length,
            affectedFilesInPackageCount:
                affectedRecords.affectedPackageFileTreesCount,
            affectedFilesAcrossAllPackagesCount:
                affectedRecords.affectedTotalFileTreesCount,
            message: "Bulk conclusion created and license conclusions added",
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

userRouter.get("/bulk-conclusions/:id", async (req, res) => {
    try {
        if (!req.user) throw new CustomError("Unauthorized", 401);

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
                message: "Bulk conclusion with the requested id does not exist",
            });
        } else {
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    }
});

userRouter.put("/bulk-conclusions/:id", async (req, res) => {
    try {
        if (!req.user) throw new CustomError("Unauthorized", 401);

        const bulkConclusionId = req.params.id;

        const origBulkCur =
            await dbQueries.findBulkConclusionById(bulkConclusionId);

        if (!origBulkCur)
            throw new CustomError("Bulk conclusion to update not found", 404);

        if (req.user.role !== "ADMIN") {
            if (req.user.id !== origBulkCur.userId) {
                throw new CustomError("Forbidden", 403);
            }
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
            (!reqPattern || reqPattern === origBulkCur.pattern) &&
            (!reqCLESPDX ||
                reqCLESPDX === origBulkCur.concludedLicenseExpressionSPDX) &&
            (!reqDLESPDX ||
                reqDLESPDX === origBulkCur.detectedLicenseExpressionSPDX) &&
            (reqComment === undefined || reqComment === origBulkCur.comment) &&
            (reqLocal === undefined || reqLocal === origBulkCur.local)
        ) {
            throw new CustomError("Nothing to update", 400, "root");
        }

        const bulkConclusionWithRelations =
            await dbQueries.findBulkConclusionWithRelationsById(
                bulkConclusionId,
                origBulkCur.package.id,
            );

        if (!bulkConclusionWithRelations)
            throw new CustomError("Bulk conclusion to update not found", 404);

        if (reqPattern && reqPattern !== bulkConclusionWithRelations.pattern) {
            const newInputs = [];
            const fileTrees = await dbQueries.findFileTreesByPackageId(
                origBulkCur.package.id,
            );

            for (const fileTree of fileTrees) {
                if (
                    minimatch(fileTree.path, reqPattern, { dot: true }) &&
                    bulkConclusionWithRelations.licenseConclusions.find(
                        (lc) => lc.file.sha256 === fileTree.fileSha256,
                    ) === undefined &&
                    newInputs.find(
                        (lc) => lc.fileSha256 === fileTree.fileSha256,
                    ) === undefined
                ) {
                    newInputs.push({
                        concludedLicenseExpressionSPDX:
                            reqCLESPDX ||
                            bulkConclusionWithRelations.concludedLicenseExpressionSPDX,
                        detectedLicenseExpressionSPDX:
                            reqDLESPDX ||
                            bulkConclusionWithRelations.detectedLicenseExpressionSPDX,
                        comment:
                            reqComment || bulkConclusionWithRelations.comment,
                        local:
                            reqLocal !== undefined
                                ? reqLocal
                                : bulkConclusionWithRelations.local,
                        contextPurl: origBulkCur.package.purl,
                        fileSha256: fileTree.fileSha256,
                        userId: req.user.id,
                        bulkConclusionId: bulkConclusionWithRelations.id,
                    });
                }
            }

            await dbQueries.createManyLicenseConclusions(newInputs);

            for (const lc of bulkConclusionWithRelations.licenseConclusions) {
                let noMatches = true;
                for (const ft of lc.file.filetrees) {
                    // If one of the paths match with the new pattern, don't delete the license conclusion
                    if (minimatch(ft.path, reqPattern, { dot: true })) {
                        noMatches = false;
                        break;
                    }
                }

                if (noMatches) {
                    await dbQueries.deleteLicenseConclusion(lc.id);
                }
            }
        }

        if (
            (reqCLESPDX &&
                reqCLESPDX !== origBulkCur.concludedLicenseExpressionSPDX) ||
            (reqDLESPDX &&
                reqDLESPDX !== origBulkCur.detectedLicenseExpressionSPDX) ||
            (reqComment && reqComment !== origBulkCur.comment) ||
            (reqLocal !== undefined && reqLocal !== origBulkCur.local)
        ) {
            await dbQueries.updateManyLicenseConclusions(bulkConclusionId, {
                concludedLicenseExpressionSPDX: reqCLESPDX,
                detectedLicenseExpressionSPDX: reqDLESPDX,
                comment: reqComment,
                local: reqLocal,
            });
        }

        await dbQueries.updateBulkConclusion(bulkConclusionId, {
            pattern: reqPattern,
            concludedLicenseExpressionSPDX: reqCLESPDX,
            detectedLicenseExpressionSPDX: reqDLESPDX,
            comment: reqComment,
            local: reqLocal,
        });

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
});

userRouter.delete("/bulk-conclusions/:id", async (req, res) => {
    try {
        if (!req.user) throw new CustomError("Unauthorized", 401);

        const bulkConclusionId = req.params.id;

        if (req.user.role !== "ADMIN") {
            const bulkConclusionUserId =
                await dbQueries.findBulkConclusionUserId(bulkConclusionId);

            if (!bulkConclusionUserId) {
                throw new CustomError(
                    "Bulk conclusion to delete not found",
                    404,
                );
            }

            if (req.user.id !== bulkConclusionUserId) {
                throw new CustomError("Forbidden", 403);
            }
        }

        await dbQueries.deleteManyLicenseConclusionsByBulkConclusionId(
            bulkConclusionId,
        );

        const deletedBulkConclusion =
            await dbQueries.deleteBulkConclusion(bulkConclusionId);

        if (!deletedBulkConclusion)
            throw new CustomError("Bulk conclusion to delete not found", 404);

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
});

userRouter.get("/packages/:purl/bulk-conclusions", async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new CustomError("Unauthorized", 401);

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

        res.status(200).json({
            bulkConclusions: bulkConclusions,
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
                message: "Package with purl " + req.params.purl + " not found",
            });
        } else {
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    }
});

userRouter.get("/path-exclusions", async (req, res) => {
    try {
        const pathExclusionsWithRelations =
            await dbQueries.findPathExclusions();

        const pathExclusions = [];
        for (const pe of pathExclusionsWithRelations) {
            const affectedPaths = [];

            for (const ft of pe.package.fileTrees) {
                if (minimatch(ft.path, pe.pattern, { dot: true })) {
                    affectedPaths.push(ft.path);
                }
            }

            pathExclusions.push({
                id: pe.id,
                updatedAt: pe.updatedAt,
                pattern: pe.pattern,
                reason: pe.reason,
                comment: pe.comment,
                user: pe.user,
                purl: pe.package.purl,
                affectedPaths: affectedPaths,
            });
        }

        return res.status(200).json({
            pathExclusions: pathExclusions,
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

userRouter.post("/packages/:purl/path-exclusions", async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Error("User not found");

        const purl = req.params.purl;
        const packageId = await dbQueries.findPackageIdByPurl(purl);

        if (!packageId) throw new Error("Package not found");

        let match = false;

        if (isGlob(req.body.pattern)) {
            const filePaths = await dbQueries.findFilePathsByPackagePurl(purl);
            // Check that a path that matches the glob pattern exists for the package
            while (!match && filePaths.length > 0) {
                const filePath = filePaths.pop();

                if (!filePath) break;
                if (
                    minimatch(filePath, req.body.pattern.trim(), { dot: true })
                ) {
                    match = true;
                }
            }
        } else {
            // Check that a matching path exists for the package
            match = await dbQueries.findMatchingPath({
                purl: purl,
                path: req.body.pattern.trim(),
            });
        }

        if (!match)
            throw new Error(
                "No matching path(s) for the provided pattern were found in the package",
            );

        const pathExclusion = await dbQueries.createPathExclusion({
            pattern: req.body.pattern,
            reason: req.body.reason,
            comment: req.body.comment || null,
            packageId: packageId,
            userId: user.id,
        });

        res.status(200).json({
            pathExclusionId: pathExclusion.id,
            message: "Path exclusion created",
        });
    } catch (error) {
        console.log("Error: ", error);
        if (error instanceof Error) {
            if (error.message === "User not found")
                res.status(401).json({ message: "Unauthorized" });
            else if (
                error.message ===
                "No matching path(s) for the provided pattern were found in the package"
            ) {
                res.status(400).json({
                    message: error.message,
                    path: "pattern",
                });
            } else
                res.status(400).json({
                    message: error.message,
                });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

userRouter.put("/path-exclusions/:id", async (req, res) => {
    try {
        if (!req.user) throw new CustomError("Unauthorized", 401);

        const pathExclusion = await dbQueries.findPathExclusionById(
            req.params.id,
        );

        if (!pathExclusion)
            throw new CustomError("Path exclusion to update not found", 404);

        if (req.user.role !== "ADMIN") {
            if (req.user.id !== pathExclusion.userId) {
                throw new CustomError("Forbidden", 403);
            }
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

        const pkg = await dbQueries.findPackageById(pathExclusion.packageId);
        if (!pkg) throw new CustomError("Package not found", 404);

        if (reqPattern && reqPattern !== pathExclusion.pattern) {
            let match = false;

            if (isGlob(reqPattern)) {
                const filePaths = await dbQueries.findFilePathsByPackagePurl(
                    pkg.purl,
                );
                // Check that a path that matches the glob pattern exists for the package
                while (!match && filePaths.length > 0) {
                    const filePath = filePaths.pop();

                    if (!filePath) break;
                    if (minimatch(filePath, reqPattern.trim(), { dot: true })) {
                        match = true;
                    }
                }
            } else {
                // Check that a matching path exists for the package
                match = await dbQueries.findMatchingPath({
                    purl: pkg.purl,
                    path: reqPattern.trim(),
                });
            }

            if (!match)
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
});

userRouter.delete("/path-exclusions/:id", async (req, res) => {
    try {
        if (!req.user) throw new Error("User not found");
        const pathExclusionId = req.params.id;

        const pathExclusionUserId =
            await dbQueries.findPathExclusionUserId(pathExclusionId);

        if (!pathExclusionUserId)
            throw new Error("Path exclusion to delete not found");

        // Make sure that the path exclusion belongs to the user or the user is admin
        if (req.user.role === "ADMIN" || req.user.id === pathExclusionUserId) {
            await dbQueries.deletePathExclusion(pathExclusionId);

            res.status(200).json({ message: "Path exclusion deleted" });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.log("Error: ", error);
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res.status(404).json({
                message: "Path exclusion with the requested id does not exist",
            });
        } else if (error instanceof Error) {
            return res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

userRouter.get("/packages/:purl/path-exclusions", async (req, res) => {
    try {
        const { user } = req;
        if (!user) throw new Error("User not found");

        const purl = req.params.purl;

        const pathExclusions =
            await dbQueries.getPathExclusionsByPackagePurl(purl);

        res.status(200).json({
            pathExclusions: pathExclusions,
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
});

userRouter.get("/packages", async (req, res) => {
    try {
        const packages = await dbQueries.findScannedPackages();
        res.status(200).json({ packages: packages });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.get("/packages/:purl/filetrees", async (req, res) => {
    try {
        const purl = req.params.purl;
        const filetrees = await dbQueries.findFileTreesByPackagePurl(purl);

        for (const ft of filetrees) {
            ft.file.licenseConclusions = ft.file.licenseConclusions.filter(
                (lc) => !(lc.local && lc.contextPurl !== purl),
            );
        }

        if (filetrees) {
            res.status(200).json({
                filetrees: filetrees,
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.get("/packages/:purl/filetrees/:path/files", async (req, res) => {
    try {
        const purl = req.params.purl;
        const path = req.params.path;

        const sha256 = await dbQueries.findFileSha256ByPurlAndPath(purl, path);

        if (!sha256) throw new CustomError("File not found", 400);

        const presignedGetUrl = await getPresignedGetUrl(
            s3Client,
            process.env.SPACES_BUCKET || "doubleopen",
            sha256,
        );

        if (!presignedGetUrl) {
            throw new CustomError(
                "Internal server error: Presigned URL is undefined",
                500,
            );
        }

        res.status(200).json({
            sha256: sha256,
            downloadUrl: presignedGetUrl,
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
});

userRouter.get("/files/:sha256/license-findings", async (req, res) => {
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
});

export default userRouter;
