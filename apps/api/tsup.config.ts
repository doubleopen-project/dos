// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "tsup";

const isProduction: boolean = process.env.NODE_ENV === "production";

const requirementsTxt = readFileSync(
    resolve(__dirname, "../../requirements.txt"),
    "utf-8",
);
const scancodeVersion =
    requirementsTxt.match(/scancode-toolkit==(.+)/)?.[1]?.trim() ?? "unknown";

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/server.ts", "tests/test.ts"],
    format: ["cjs", "esm"],
    minify: isProduction,
    sourcemap: true,
    define: {
        __SCANCODE_VERSION__: JSON.stringify(scancodeVersion),
    },
});
