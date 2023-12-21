// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

/**
 * @type {import('prettier').Config & import("@ianvs/prettier-plugin-sort-imports").PluginConfig & import ("prettier-plugin-tailwindcss").PluginConfig}
 */
const config = {
    tabWidth: 4,
    plugins: [
        "@ianvs/prettier-plugin-sort-imports",
        "prettier-plugin-tailwindcss",
    ],
    importOrder: [
        "^react$",
        "<THIRD_PARTY_MODULES>",
        "^@core/(.*)$",
        "^@server/(.*)$",
        "^@/hooks/(.*)$",
        "^@/store/(.*)$",
        "^@/components/ui/(.*)$",
        "^@/(.*)$",
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "5.2.2",
};

export default config;
