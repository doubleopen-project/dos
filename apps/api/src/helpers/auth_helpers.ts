// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 60 });

const tokens =
    process.env.API_TOKENS?.split(",")
        .map((token) => token.trim())
        .filter((token) => token.length > 0) || [];

export const authenticateDosApiToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Allow access to the API in development without setting tokens.
        if (process.env.NODE_ENV !== "production" && tokens.length === 0)
            next();
        else {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];

            if (token == null)
                return res.status(401).json({ message: "Unauthorized" });

            // Cache is used for (GET) job-state requests
            const useCache = req.originalUrl.split("/")[2] === "job-state";

            if (useCache && cache.has(token)) next();
            else {
                if (tokens.includes(token)) {
                    cache.set(token, true);
                    next();
                } else return res.status(403).json({ message: "Forbidden" });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
