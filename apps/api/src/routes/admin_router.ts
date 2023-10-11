// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { adminAPI } from "validation-helpers";
import * as dbQueries from "../helpers/db_queries";
import * as dbOperations from "../helpers/db_operations";
import crypto from "crypto";

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
            : null;
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
                    res.send({ message: "User created" });
                },
            );
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Delete scan results for a specified package purl
adminRouter.delete("/scan-results", async (req, res) => {
    // TODO: this endpoint should only be used by specific users
    try {
        const message = await dbOperations.deletePackageDataByPurl(
            req.body.purl,
        );
        res.status(200).json({ message: message });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default adminRouter;
