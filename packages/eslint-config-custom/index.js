// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    extends: ["next", "next/core-web-vitals", "turbo", "prettier"],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
    },
};