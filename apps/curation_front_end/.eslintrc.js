// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    root: true,
    extends: ["custom"],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./tsconfig.eslint.json"],
    }
};