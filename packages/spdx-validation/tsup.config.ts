// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { defineConfig } from "tsup";

const isProduction: boolean = process.env.NODE_ENV === "production";

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.ts", "tests/test.ts"],
    format: ["cjs", "esm"],
    minify: isProduction,
    sourcemap: true,
});
