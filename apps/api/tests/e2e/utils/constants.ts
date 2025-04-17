// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const baseUrl = process.env.CI
    ? "http://api:3001"
    : "http://localhost:5000";
