// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

export class CustomError extends Error {
    statusCode: number;
    path?: string;
    constructor(message: string, statusCode: number, path?: string) {
        super(message);
        this.statusCode = statusCode;
        this.path = path;
    }
}
