// SPDX-FileCopyrightText: 2025 Double Open Oy
//
// SPDX-License-Identifier: MIT

export const baseUrl = process.env.CI
    ? "http://api:3001"
    : "http://localhost:5000";

export const testPurl =
    "pkg:npm/dos-monorepo@0.0.0?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Fdoubleopen-project%2Fdos.git&vcs_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6&resolved_revision=dc27d024ea5c001def72122c8c0f8c148cec39b6";
