// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const timeout = process.env.SCANNER_TIMEOUT
    ? parseInt(process.env.SCANNER_TIMEOUT)
    : 1200;
