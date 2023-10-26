// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { userAPI } from "validation-helpers";
import * as dbQueries from "../helpers/db_queries";
import * as s3Helpers from "s3-helpers";
import { hashPassword } from "../helpers/password_helper";
import { Prisma } from "database";
import crypto from "crypto";

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

userRouter.post("/license-conclusion", async (req, res) => {
    try {
        if (!req.user) throw new Error("User not found");

        const licenseConclusion = await dbQueries.createLicenseConclusion({
            concludedLicenseExpressionSPDX:
                req.body.concludedLicenseExpressionSPDX,
            detectedLicenseExpressionSPDX:
                req.body.detectedLicenseExpressionSPDX || null,
            comment: req.body.comment,
            contextPurl: req.body.contextPurl,
            fileSha256: req.body.fileSha256,
            userId: req.user.id,
        });

        res.status(200).json({
            licenseConclusionId: licenseConclusion.id,
            message: "License conclusion created",
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.put("/license-conclusion/:id", async (req, res) => {
    try {
        if (!req.user) throw new Error("User not found");

        const licenseConclusionId = req.params.id;
        const licenseConclusionUserId =
            await dbQueries.findLicenseConclusionUserId(licenseConclusionId);

        if (!licenseConclusionUserId)
            throw new Error("License conclusion to update not found");

        // Make sure that the license conclusion belongs to the user or the user is admin
        if (
            req.user.role === "ADMIN" ||
            req.user.id === licenseConclusionUserId
        ) {
            await dbQueries.updateLicenseConclusion(licenseConclusionId, {
                concludedLicenseExpressionSPDX:
                    req.body.concludedLicenseExpressionSPDX,
                detectedLicenseExpressionSPDX:
                    req.body.detectedLicenseExpressionSPDX,
                comment: req.body.comment,
                contextPurl: req.body.contextPurl,
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

userRouter.post("/path-exclusion", async (req, res) => {
    try {
        const { user } = req;

        if (!user) throw new Error("User not found");

        const packageId = await dbQueries.findPackageIdByPurl(req.body.purl);

        if (!packageId) throw new Error("Package not found");

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
        res.status(500).json({ message: "Internal server error" });
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
        const presignedGetUrl = await s3Helpers.getPresignedGetUrl(
            sha256,
            process.env.SPACES_BUCKET as string,
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
