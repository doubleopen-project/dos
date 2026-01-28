// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import type { ApiScope } from "database";
import type { NextFunction, Request, Response } from "express";
import { hashApiToken } from "../helpers/api_tokens";
import { findApiTokenByHash } from "../helpers/db_queries";
import { authCache } from "../services/auth_cache";

export const authenticateDosApiToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [scheme, token] = authHeader.split(" ");

        if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const tokenHash = hashApiToken(token.trim());

        // Use cache for job-state requests as these are polled frequently
        const useCache =
            req.method === "GET" && req.path.startsWith("/job-state");

        if (useCache && authCache.has(tokenHash)) {
            req.apiTokenAuth = authCache.get(tokenHash);
            return next();
        }

        const apiToken = await findApiTokenByHash(tokenHash);

        if (!apiToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!apiToken.isActive) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const apiTokenAuth = {
            apiTokenId: apiToken.id,
            scopes: apiToken.scopes.map((scope) => scope.scope),
            clearanceGroupIds: apiToken.clearanceGroups.map(
                (g) => g.clearanceGroup.id,
            ),
        };

        req.apiTokenAuth = apiTokenAuth;

        if (useCache) authCache.set(tokenHash, apiTokenAuth);

        return next();
    } catch (error) {
        console.error("Error in authenticateDosApiToken:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const requireApiScope = (scope: ApiScope) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.apiTokenAuth) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!req.apiTokenAuth.scopes.includes(scope)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        return next();
    };
};
