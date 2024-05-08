// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";
import { getUsers } from "./keycloak_queries";

const cache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 60 });

export const authenticateSAToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const saToken = process.env.SA_API_TOKEN || "token";
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (token == null)
            return res.status(401).json({ message: "Unauthorized" });

        if (token === saToken) next();
        else return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const authenticateDosApiToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (token == null)
            return res.status(401).json({ message: "Unauthorized" });

        // Cache is used for (GET) job-state requests
        const useCache = req.originalUrl.split("/")[2] === "job-state";

        if (useCache && cache.has(token)) next();
        else {
            const users = await getUsers(undefined, token, undefined);
            if (users.length > 0) {
                cache.set(token, true);
                next();
            } else return res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
