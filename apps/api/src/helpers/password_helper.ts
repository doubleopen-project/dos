// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import crypto from "crypto";

export const hashPassword = (
    password: string,
): Promise<{ hashedPassword: Buffer; salt: Buffer }> => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            password,
            salt,
            310000,
            32,
            "sha256",
            (err, derivedKey) => {
                if (err) {
                    reject(err);
                }
                resolve({
                    hashedPassword: derivedKey,
                    salt,
                });
            },
        );
    });
};
