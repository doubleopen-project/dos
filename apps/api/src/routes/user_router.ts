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

userRouter.get("/license-conclusion", async (req, res) => {
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
                    additionalMatches.push({
                        path: ft.path,
                        purl: ft.package.purl,
                    });
                }
            }

            licenseConclusions.push({
                id: lc.id,
                updatedAt: lc.updatedAt,
                concludedLicenseExpressionSPDX:
                    lc.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX: lc.detectedLicenseExpressionSPDX,
                comment: lc.comment,
                user: lc.user,
                bulkCurationId: lc.bulkCurationId,
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

userRouter.post("/license-conclusion", async (req, res) => {
    try {
        if (!req.user) throw new Error("User not found");

        // Make sure that a package with purl exists
        const packageId = await dbQueries.findPackageIdByPurl(
            req.body.contextPurl,
        );

        if (!packageId)
            throw new Error("Package with specified purl not found");

        // Make sure that a file with sha256 exists in package with purl
        const filetree = await dbQueries.findFiletreeByPackageIdAndFileSha256(
            packageId,
            req.body.fileSha256,
        );

        if (!filetree)
            throw new Error(
                "File with specified sha256 does not exist in the specified context package",
            );

        const licenseConclusion = await dbQueries.createLicenseConclusion({
            concludedLicenseExpressionSPDX:
                req.body.concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX:
                req.body.detectedLicenseExpressionSPDX || null,
            comment: req.body.comment || null,
            contextPurl: req.body.contextPurl,
            fileSha256: req.body.fileSha256,
            userId: req.user.id,
        });

        res.status(200).json({
            licenseConclusionId: licenseConclusion.id,
            message: "License conclusion created",
        });
    } catch (error) {
        if (error instanceof Error) {
            return res
                .status(400)
                .json({ message: "Bad request. " + error.message });
        } else {
            console.log("Error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

userRouter.put("/license-conclusion/:id", async (req, res) => {
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
                /*
                 * The following will detach the license conclusion from a bulk curation if it is connected to one
                 * (since this endpoint is used to update one license conclusion only, and the bulk curation
                 * is updated through the PUT /bulk-curation/:id endpoint)
                 */
                bulkCurationId: licenseConclusion.bulkCurationId
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

userRouter.delete("/license-conclusion/:id", async (req, res) => {
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

userRouter.post("/bulk-curation", async (req, res) => {
    try {
        const { user } = req;

        if (!user) throw new CustomError("Unauthorized", 401);

        const packageId = await dbQueries.findPackageIdByPurl(req.body.purl);

        if (!packageId)
            throw new CustomError(
                "Bad request. No package with the provided purl was found",
                400,
            );

        const licenseConclusionInputs = [];

        const fileTrees = await dbQueries.findFileTreesByPackageId(packageId);

        const pattern = req.body.pattern.trim();

        const bulkCuration = await dbQueries.createBulkCuration({
            pattern: pattern,
            concludedLicenseExpressionSPDX:
                req.body.concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX:
                req.body.detectedLicenseExpressionSPDX || null,
            comment: req.body.comment || null,
            packageId: packageId,
            userId: user.id,
        });

        let mathchedPathsCount = 0;

        for (const fileTree of fileTrees) {
            if (minimatch(fileTree.path, pattern)) {
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
                        contextPurl: req.body.purl,
                        fileSha256: fileTree.fileSha256,
                        userId: user.id,
                        bulkCurationId: bulkCuration.id,
                    });
            }
        }

        if (licenseConclusionInputs.length === 0) {
            const deletedBulkCuration = await dbQueries.deleteBulkCuration(
                bulkCuration.id,
            );
            if (!deletedBulkCuration)
                console.log(
                    "Unable to delete bulk curation id: " + bulkCuration.id,
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
            const deletedBulkCuration = await dbQueries.deleteBulkCuration(
                bulkCuration.id,
            );
            if (!deletedBulkCuration)
                console.log(
                    "Unable to delete bulk curation id: " + bulkCuration.id,
                );
            throw new CustomError(
                "Internal server error: Error creating license conclusions",
                500,
            );
        }

        const affectedRecords = await dbQueries.bulkCurationAffectedRecords(
            bulkCuration.id,
            packageId,
        );

        res.status(200).json({
            bulkCurationId: bulkCuration.id,
            matchedPathsCount: mathchedPathsCount,
            addedLicenseConclusionsCount: licenseConclusionInputs.length,
            affectedFilesInPackageCount:
                affectedRecords.affectedPackageFileTreesCount,
            affectedFilesAcrossAllPackagesCount:
                affectedRecords.affectedTotalFileTreesCount,
            message: "Bulk curation created and license conclusions added",
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

userRouter.get("/bulk-curation/:id", async (req, res) => {
    try {
        if (!req.user) throw new CustomError("Unauthorized", 401);

        const bulkCurationId = req.params.id;

        const bulkCuration =
            await dbQueries.findBulkCurationById(bulkCurationId);

        if (!bulkCuration)
            throw new CustomError(
                "Bulk curation with the requested id does not exist",
                404,
            );

        const bulkCurationWithRelations =
            await dbQueries.findBulkCurationWithRelationsById(
                bulkCurationId,
                bulkCuration.package.id,
            );

        if (!bulkCurationWithRelations)
            throw new CustomError("Bulk curation not found", 404);

        const filepaths = [];
        const licenseConclusions = [];

        for (const lc of bulkCurationWithRelations.licenseConclusions) {
            for (const filetree of lc.file.filetrees) {
                filepaths.push({ path: filetree.path });
            }
            licenseConclusions.push({ id: lc.id });
        }

        res.status(200).json({
            pattern: bulkCuration.pattern,
            concludedLicenseExpressionSPDX:
                bulkCuration.concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX:
                bulkCuration.detectedLicenseExpressionSPDX,
            comment: bulkCuration.comment,
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
                message: "Bulk curation with the requested id does not exist",
            });
        } else {
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    }
});

userRouter.put("/bulk-curation/:id", async (req, res) => {
    try {
        if (!req.user) throw new CustomError("Unauthorized", 401);

        const bulkCurationId = req.params.id;

        const bulkCuration =
            await dbQueries.findBulkCurationById(bulkCurationId);

        if (!bulkCuration)
            throw new CustomError("Bulk curation to update not found", 404);

        if (req.user.role !== "ADMIN") {
            if (req.user.id !== bulkCuration.userId) {
                throw new CustomError("Forbidden", 403);
            }
        }

        if (
            (req.body.pattern && req.body.pattern === bulkCuration.pattern) ||
            (req.body.concludedLicenseExpressionSPDX &&
                req.body.concludedLicenseExpressionSPDX ===
                    bulkCuration.concludedLicenseExpressionSPDX) ||
            (req.body.detectedLicenseExpressionSPDX &&
                req.body.detectedLicenseExpressionSPDX ===
                    bulkCuration.detectedLicenseExpressionSPDX) ||
            (req.body.comment && req.body.comment === bulkCuration.comment)
        ) {
            throw new CustomError("Nothing to update", 400);
        }

        const bulkCurationWithRelations =
            await dbQueries.findBulkCurationWithRelationsById(
                bulkCurationId,
                bulkCuration.package.id,
            );

        if (!bulkCurationWithRelations)
            throw new CustomError("Bulk curation to update not found", 404);

        const pattern = req.body.pattern;
        if (pattern && pattern !== bulkCurationWithRelations.pattern) {
            const newInputs = [];
            const fileTrees = await dbQueries.findFileTreesByPackageId(
                bulkCuration.package.id,
            );

            for (const fileTree of fileTrees) {
                if (
                    minimatch(fileTree.path, pattern) &&
                    bulkCurationWithRelations.licenseConclusions.find(
                        (lc) => lc.file.sha256 === fileTree.fileSha256,
                    ) === undefined
                ) {
                    newInputs.push({
                        concludedLicenseExpressionSPDX:
                            req.body.concludedLicenseExpressionSPDX ||
                            bulkCurationWithRelations.concludedLicenseExpressionSPDX,
                        detectedLicenseExpressionSPDX:
                            req.body.detectedLicenseExpressionSPDX ||
                            bulkCurationWithRelations.detectedLicenseExpressionSPDX,
                        comment:
                            req.body.comment ||
                            bulkCurationWithRelations.comment,
                        contextPurl: bulkCuration.package.purl,
                        fileSha256: fileTree.fileSha256,
                        userId: req.user.id,
                        bulkCurationId: bulkCurationWithRelations.id,
                    });
                }
            }

            await dbQueries.createManyLicenseConclusions(newInputs);

            for (const lc of bulkCurationWithRelations.licenseConclusions) {
                // Using the first filetree only because the file hash is the same,
                // so the licenseConclusion is the same one for all filetrees
                if (!minimatch(lc.file.filetrees[0].path, pattern)) {
                    await dbQueries.deleteLicenseConclusion(lc.id);
                }
            }
        }

        if (
            req.body.concludedLicenseExpressionSPDX ||
            req.body.detectedLicenseExpressionSPDX ||
            req.body.comment
        ) {
            await dbQueries.updateManyLicenseConclusions(bulkCurationId, {
                concludedLicenseExpressionSPDX:
                    req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX:
                    req.body.detectedLicenseExpressionSPDX,
                comment: req.body.comment,
            });
        }

        await dbQueries.updateBulkCuration(bulkCurationId, {
            pattern: req.body.pattern,
            concludedLicenseExpressionSPDX:
                req.body.concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX:
                req.body.detectedLicenseExpressionSPDX,
            comment: req.body.comment,
        });

        res.status(200).json({ message: "Bulk curation updated" });
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
                message: "Bulk curation to update not found",
            });
        } else {
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    }
});

userRouter.delete("/bulk-curation/:id", async (req, res) => {
    try {
        if (!req.user) throw new CustomError("Unauthorized", 401);

        const bulkCurationId = req.params.id;

        if (req.user.role !== "ADMIN") {
            const bulkCurationUserId =
                await dbQueries.findBulkCurationUserId(bulkCurationId);

            if (!bulkCurationUserId) {
                throw new CustomError("Bulk curation to delete not found", 404);
            }

            if (req.user.id !== bulkCurationUserId) {
                throw new CustomError("Forbidden", 403);
            }
        }

        await dbQueries.deleteManyLicenseConclusionsByBulkCurationId(
            bulkCurationId,
        );

        const deletedBulkCuration =
            await dbQueries.deleteBulkCuration(bulkCurationId);

        if (!deletedBulkCuration)
            throw new CustomError("Bulk curation to delete not found", 404);

        res.status(200).json({ message: "Bulk curation deleted" });
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
                message: "Bulk curation to delete not found",
            });
        } else {
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    }
});

userRouter.post("/bulk-curations", async (req, res) => {
    try {
        const { user } = req;

        if (!user) throw new CustomError("Unauthorized", 401);

        const packageId = await dbQueries.findPackageIdByPurl(req.body.purl);

        if (!packageId)
            throw new CustomError(
                "Package with purl " + req.body.purl + " not found",
                404,
            );

        const bulkCurations =
            await dbQueries.findBulkCurationsByPackageId(packageId);

        res.status(200).json({
            bulkCurations: bulkCurations,
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
                message: "Package with purl " + req.body.purl + " not found",
            });
        } else {
            const err = await getErrorCodeAndMessage(error);
            res.status(err.statusCode).json({ message: err.message });
        }
    }
});

userRouter.post("/path-exclusion", async (req, res) => {
    try {
        const { user } = req;

        if (!user) throw new Error("User not found");

        const packageId = await dbQueries.findPackageIdByPurl(req.body.purl);

        if (!packageId) throw new Error("Package not found");

        let match = false;

        if (isGlob(req.body.pattern)) {
            const filePaths = await dbQueries.findFilePathsByPackagePurl(
                req.body.purl,
            );
            // Check that a path that matches the glob pattern exists for the package
            while (!match && filePaths.length > 0) {
                const filePath = filePaths.pop();

                if (!filePath) break;
                if (minimatch(filePath, req.body.pattern.trim())) {
                    match = true;
                }
            }
        } else {
            // Check that a matching path exists for the package
            match = await dbQueries.findMatchingPath({
                purl: req.body.purl,
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

userRouter.delete("/path-exclusion/:id", async (req, res) => {
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

userRouter.post("/path-exclusions", async (req, res) => {
    try {
        const { user } = req;

        if (!user) throw new Error("User not found");

        const pathExclusions = await dbQueries.getPathExclusionsByPackagePurl(
            req.body.purl,
        );

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

userRouter.post("/file", async (req, res) => {
    try {
        let sha256 = null;

        if (req.body.sha256) sha256 = req.body.sha256;
        else if (req.body.purl && req.body.path) {
            sha256 = await dbQueries.findFileSha256(
                req.body.purl,
                req.body.path,
            );
        }

        if (!sha256) throw new Error("sha256 not found");

        console.log("Searching data for file sha256: ", sha256);

        const fileData = await dbQueries.findFileData(sha256);
        const presignedGetUrl = await getPresignedGetUrl(
            s3Client,
            process.env.SPACES_BUCKET || "doubleopen",
            sha256,
        );

        if (!presignedGetUrl) {
            throw new Error("Error: Presigned URL is undefined");
        }

        if (fileData) {
            res.status(200).json({
                sha256: sha256,
                downloadUrl: presignedGetUrl,
                licenseFindings: fileData.licenseFindings,
                copyrightFindings: fileData.copyrightFindings,
                licenseConclusions: fileData.licenseConclusions,
            });
        } else {
            res.status(400).json({
                message:
                    "Bad request: File with the requested sha256 does not exist",
            });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
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

userRouter.post("/filetree", async (req, res) => {
    try {
        const filetrees = await dbQueries.findFileTreesByPackagePurl(
            req.body.purl,
        );

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

export default userRouter;
