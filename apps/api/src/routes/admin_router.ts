// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
import { zodiosRouter } from "@zodios/express";
import { Prisma } from "database";
import { adminAPI } from "validation-helpers";
import { CustomError } from "../helpers/custom_error";
import * as dbOperations from "../helpers/db_operations";
import * as dbQueries from "../helpers/db_queries";
import { runPurlCleanup } from "../helpers/purl_cleanup_helpers";

const adminRouter = zodiosRouter(adminAPI);

// ----------------------------------- ADMIN ROUTES -----------------------------------

adminRouter.post("/user", async (req, res) => {
    try {
        const { username, password } = req.body;
        const role = req.body.role ? req.body.role : "USER";
        const subscription = req.body.subscription
            ? req.body.subscription
            : role == "ADMIN"
              ? "GOLD"
              : "SILVER";
        const user = await dbQueries.findUserByUsername(username);
        if (user) {
            res.status(400).send({ message: "User already exists" });
        } else {
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(
                password,
                salt,
                310000,
                32,
                "sha256",
                async (err, derivedKey) => {
                    if (err) {
                        console.log("Error: ", err);
                        res.status(500).send({
                            message: "Internal server error",
                        });
                    }
                    const hashedPassword = derivedKey;
                    const token = req.body.token
                        ? req.body.token
                        : crypto.randomBytes(16).toString("hex");
                    await dbQueries.createUser({
                        username,
                        hashedPassword,
                        salt,
                        token,
                        role,
                        subscription,
                    });
                    res.send({
                        username: req.body.username,
                        password: req.body.password,
                        role: role,
                        subscription: subscription,
                        token: token,
                    });
                },
            );
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Delete user by id
adminRouter.delete("/user/:id", async (req, res) => {
    try {
        const deletedUser = await dbQueries.deleteUser(req.params.id);

        if (deletedUser) res.status(200).json({ message: "User deleted" });
        else res.status(400).json({ message: "User to delete not found" });
    } catch (error) {
        console.log("Error: ", error);
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res.status(404).json({
                message: "User to delete not found",
            });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// Update user by id
adminRouter.put("/user/:id", async (req, res) => {
    try {
        await dbQueries.updateUser(req.params.id, req.body);

        const batches = await dbQueries.updateManyKcUserIds(
            req.params.id,
            req.body.kcUserId,
        );

        const lcs = await dbQueries.findLicenseConclusionsByUserId(
            req.params.id,
        );
        const bcs = await dbQueries.findBulkConclusionsByUserId(req.params.id);
        const pes = await dbQueries.findPathExclusionsByUserId(req.params.id);

        if (lcs.length !== batches.lcCount)
            throw new CustomError("License conclusion counts don't match", 500);

        if (bcs.length !== batches.bcCount)
            throw new CustomError("Bulk conclusions counts don't match", 500);

        if (pes.length !== batches.peCount)
            throw new CustomError("Path exclusions counts don't match", 500);

        res.status(200).json({ message: "User updated" });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete scan results for a specified package purl
adminRouter.delete("/scan-results", async (req, res) => {
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
});

adminRouter.post("/purl-cleanup", async (req, res) => {
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
        if (!req.body.options || Object.keys(req.body.options).length === 0) {
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
});

export default adminRouter;
