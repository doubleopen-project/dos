/*
 * Parser is based on spdx-expression-parse.js <https://github.com/jslicense/spdx-expression-parse.js>, which is licensed under MIT and includes the following copyright holders:
 * SPDX-FileCopyrightText: 2015 Kyle E. Mitchell <kyle@kemitchell.com> (https://kemitchell.com)
 * SPDX-FileCopyrightText: 2015 C. Scott Ananian <cscott@cscott.net> (http://cscott.net)
 * SPDX-FileCopyrightText: 2015 Shinnosuke Watanabe <snnskwtnb@gmail.com>
 * SPDX-FileCopyrightText: 2015 Antoine Motet <antoine.motet@gmail.com>
 *
 *
 * SPDX-FileCopyrightText: 2024 Double Open Oy <support@doubleopen.org>
 *
 * SPDX-License-Identifier: MIT
 */

// The ABNF grammar in the spec is totally ambiguous.
//
// This parser follows the operator precedence defined in the
// `Order of Precedence and Parentheses` section.

export interface Token {
    type: "OPERATOR" | "LICENSE" | "DOCUMENTREF" | "LICENSEREF" | "EXCEPTION";
    string: string;
}

export interface LicenseInfo {
    license: string;
    plus?: true | undefined;
    exception?: string | undefined;
}

export interface ConjunctionInfo {
    conjunction: "and" | "or";
    left: LicenseInfo | ConjunctionInfo;
    right: LicenseInfo | ConjunctionInfo;
}

export const parse = (tokens: Token[]): LicenseInfo | ConjunctionInfo => {
    let index = 0;

    function hasMore() {
        return index < tokens.length;
    }

    function token() {
        return hasMore() ? tokens[index] : null;
    }

    function next() {
        if (!hasMore()) {
            throw new Error();
        }
        index++;
    }

    function parseOperator(operator: string) {
        const t = token();
        if (t && t.type === "OPERATOR" && operator === t.string) {
            next();
            return t.string;
        }
    }

    function parseWith() {
        if (parseOperator("WITH")) {
            const t = token();
            // This change is here to comply with the current strictness setting
            // for license checking in DOS: license WITH LicenseRef is allowed,
            // if it includes the "exception" keyword,
            // even if not strictly complying with SPDX rules (expecting AND).
            if (
                t &&
                (t.type === "EXCEPTION" ||
                    (t.type === "LICENSEREF" && t.string.includes("exception")))
            ) {
                next();
                return t.string;
            }
            throw new Error(
                "Expected exception or LicenseRef with `...exception...` after `WITH`",
            );
        }
    }

    function parseLicenseRef() {
        // TODO: Actually, everything is concatenated into one string
        // for backward-compatibility but it could be better to return
        // a nice structure.
        const begin = index;
        let string = "";
        let t = token();
        if (t && t.type === "DOCUMENTREF") {
            next();
            string += "DocumentRef-" + t.string + ":";
            if (!parseOperator(":")) {
                throw new Error("Expected `:` after `DocumentRef-...`");
            }
        }
        t = token();
        if (t && t.type === "LICENSEREF") {
            next();
            string += "LicenseRef-" + t.string;
            return { license: string };
        }
        index = begin;
    }

    function parseLicense() {
        const t = token();
        if (t && t.type === "LICENSE") {
            next();
            const node: {
                license: string;
                plus?: true | undefined;
                exception?: string | undefined;
            } = { license: t.string };
            if (parseOperator("+")) {
                node.plus = true;
            }
            const exception = parseWith();
            if (exception) {
                node.exception = exception;
            }
            return node;
        }
    }

    function parseParenthesizedExpression() {
        const left = parseOperator("(");
        if (!left) {
            return;
        }

        const expr = parseExpression();

        if (!parseOperator(")")) {
            throw new Error("Expected `)`");
        }

        return expr;
    }

    function parseAtom() {
        return (
            parseParenthesizedExpression() ||
            parseLicenseRef() ||
            parseLicense()
        );
    }

    function makeBinaryOpParser(
        operator: "AND" | "OR",
        nextParser: () => ConjunctionInfo | LicenseInfo | undefined,
    ) {
        return function parseBinaryOp():
            | ConjunctionInfo
            | LicenseInfo
            | undefined {
            const left = nextParser();
            if (!left) {
                return;
            }

            if (!parseOperator(operator)) {
                return left;
            }

            const right = parseBinaryOp();
            if (!right) {
                throw new Error("Expected expression");
            }
            return {
                left: left,
                conjunction: operator.toLowerCase() as "and" | "or",
                right: right,
            };
        };
    }

    const parseAnd = makeBinaryOpParser("AND", parseAtom);
    const parseExpression = makeBinaryOpParser("OR", parseAnd);

    const node = parseExpression();
    if (!node || hasMore()) {
        throw new Error("Syntax error");
    }
    return node;
};
