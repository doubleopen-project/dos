// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { zodiosRouter } from "@zodios/express";
import { authAPI } from "validation-helpers";
import kcAdminClient from "../../config/keycloak_admin_client";

const authRouter = zodiosRouter(authAPI);

authRouter.post("/logout", async (req, res) => {
    try {
        const userId = req.kauth.grant.access_token.content.sub;
        const kc = await kcAdminClient();

        await kc.users.logout({ id: userId });
        res.send({ message: "Logged out" });
    } catch (error) {
        console.log("Error (logout): ", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

export default authRouter;
