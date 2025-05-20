// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Zodios } from "@zodios/core";
import { isAxiosError } from "axios";
import { authConfig } from "common-helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import { keycloakAPI } from "validation-helpers";

const kcClient = new Zodios(authConfig.url, keycloakAPI);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const response = await kcClient.GetUserInfo({
            params: {
                realm: authConfig.realm,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: req.headers.authorization,
            },
        });

        return res.status(200).json({ response });
    } catch (error) {
        if (isAxiosError(error)) {
            res.status(error.response?.status || 500).json(
                error.response?.data || { message: error.message },
            );
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
