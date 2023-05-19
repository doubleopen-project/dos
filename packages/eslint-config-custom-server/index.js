// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
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
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/typedef": [
            "error", 
            {
                arrayDestructuring: true,
                arrowParameter: true,
                memberVariableDeclaration: true,
                objectDestructuring: true,
                parameter: true,
                propertyDeclaration: true,
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: true
            }
        ],
        "no-unused-vars": "error",
        // These rules might have to be disabled due to suspected bug in linting.
        // See https://github.com/t3-oss/create-t3-app/blob/next/.eslintrc.cjs
        //"@typescript-eslint/no-unsafe-argument": "off",
        //"@typescript-eslint/no-unsafe-assignment": "off",
        //"@typescript-eslint/no-unsafe-call": "off",
        //"@typescript-eslint/no-unsafe-member-access": "off",
        //"@typescript-eslint/no-unsafe-return": "off",
        //"@typescript-eslint/no-unnecessary-type-assertion": "off",
    }
};