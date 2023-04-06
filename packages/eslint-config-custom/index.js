// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    extends: ["next", "turbo", "prettier"],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
    },
};