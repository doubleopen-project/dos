// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";

const TOKEN_HMAC_SECRET = process.env.TOKEN_HMAC_SECRET || "secret";

export const generateApiToken = (): string => {
    return crypto.randomBytes(32).toString("base64url");
};

export const hashApiToken = (token: string): string => {
    return crypto
        .createHmac("sha256", TOKEN_HMAC_SECRET)
        .update(token)
        .digest("hex");
};
