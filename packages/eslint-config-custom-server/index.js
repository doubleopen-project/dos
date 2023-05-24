// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    extends: [
        "plugin:@typescript-eslint/recommended",
        "turbo"
    ],
    env: {
        node: true,
        es6: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint"
    ],
    overrides: [
        {
            files: ["**/__tests__/**/*"],
            env: {
                jest: true,
            },
        },
    ],
    rules: {
        
    }
};