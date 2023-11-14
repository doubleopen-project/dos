// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    extends: [
        "prettier",
        "turbo",
        "plugin:@typescript-eslint/recommended",
        "plugin:@next/next/recommended",
        "plugin:jest-dom/recommended",
        "plugin:testing-library/react",
        "plugin:react-hooks/recommended",
    ],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
    },
};
