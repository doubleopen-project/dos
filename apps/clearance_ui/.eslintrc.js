// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    root: true,
    extends: ["custom"],
    overrides: [
        {
            files: ["tests/e2e/**/*.ts"],
            extends: ["plugin:playwright/recommended"],
        },
        {
            files: ["tests/unit/**/*.ts"],
            rules: {
                "playwright/no-standalone-expect": "off",
            },
        },
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./tsconfig.eslint.json"],
    },
    ignorePatterns: ["next.config.js"],
};
