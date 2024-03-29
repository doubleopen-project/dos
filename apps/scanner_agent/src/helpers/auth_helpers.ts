// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT
import { NextFunction, Request, Response } from "express";

const SA_API_TOKEN = process.env.SA_API_TOKEN || "token";

export const authenticateAPIToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.status(401).json({ message: "Unauthorized" });

    //console.log('Token: ' + token);
    //console.log('API_TOKEN: ' + process.env.SERVER_TOKEN);

    if (token === SA_API_TOKEN) {
        next();
    } else {
        return res.status(403).json({ message: "Forbidden" });
    }
};
