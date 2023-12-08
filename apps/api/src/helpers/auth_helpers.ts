// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT
import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";
import { findUser } from "./db_queries";

const cache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 60 });

export const authenticateORTToken = async (
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
        else if (await findUser(token)) {
            cache.set(token, true);
            next();
        } else return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

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

export const authenticateAdminToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (token == null)
            return res.status(401).json({ message: "Unauthorized" });

        const user = await findUser(token);
        if (
            token === process.env.ADMIN_TOKEN ||
            (user && user.role === "ADMIN")
        )
            next();
        else return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const authorizeAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user } = req;
        if (
            (user && user.role === "ADMIN") ||
            req.body.token === process.env.ADMIN_TOKEN
        )
            next();
        else return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const authorizeUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user } = req;

        if (user) next();
        else return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
