// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

module.exports = {
    root: true,
    extends: ["custom-server"],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./tsconfig.eslint.json"],
    },
    exclude: ["dist/*", "index.d.ts"],
};
