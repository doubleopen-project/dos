// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";
import { zodiosRouter } from "@zodios/express";
import { userAPI } from "validation-helpers";
import { CustomError } from "../../helpers/custom_error";
import { updateUser } from "../../helpers/keycloak_queries";

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

export default userRouter;
