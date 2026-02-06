// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, "../../"),
    outputFileTracingIncludes: {
        "/**": ["../../node_modules/next/dist/**"],
    },
};

module.exports = nextConfig;
