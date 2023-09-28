// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    extends: [
        "next",
        "next/core-web-vitals", 
        "react-hooks",
        "prettier",
        "turbo"
    ],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    },
};