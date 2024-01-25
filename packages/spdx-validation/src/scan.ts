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

import exceptions from "spdx-exceptions";
import licenses from "spdx-license-ids";
import { Token } from "./parse";

export const scan = (source: string): Token[] => {
    let index = 0;

    function hasMore() {
        return index < source.length;
    }

    // `value` can be a regexp or a string.
    // If it is recognized, the matching source string is returned and
    // the index is incremented. Otherwise `undefined` is returned.
    function read(value: string | RegExp): string | undefined {
        if (value instanceof RegExp) {
            const chars = source.slice(index);
            const match = chars.match(value);
            if (match) {
                index += match[0].length;
                return match[0];
            }
        } else {
            if (source.indexOf(value, index) === index) {
                index += value.length;
                return value;
            }
        }
    }

    function skipWhitespace() {
        read(/[ ]*/);
    }

    function operator(): Token | undefined {
        let string;
        const possibilities = [/^WITH/i, /^AND/i, /^OR/i, "(", ")", ":", "+"];
        for (let i = 0; i < possibilities.length; i++) {
            string = read(possibilities[i]);
            if (string) {
                break;
            }
        }

        if (string === "+" && index > 1 && source[index - 2] === " ") {
            throw new Error("Space before `+`");
        }

        if (string) {
            return {
                type: "OPERATOR",
                string: string.toUpperCase(),
            };
        } else return undefined;
    }

    function idstring() {
        return read(/[A-Za-z0-9-.]+/);
    }

    function expectIdstring() {
        const string = idstring();
        if (!string) {
            throw new Error("Expected idstring at offset " + index);
        }
        return string;
    }

    function documentRef(): Token | undefined {
        if (read("DocumentRef-")) {
            const string = expectIdstring();
            return { type: "DOCUMENTREF", string: string };
        }
    }

    function licenseRef(): Token | undefined {
        if (read("LicenseRef-")) {
            const string = expectIdstring();
            return { type: "LICENSEREF", string: string };
        }
    }

    function identifier(): Token | undefined {
        let begin = index;
        const string = idstring();

        if (string) {
            if (licenses.indexOf(string) !== -1) {
                return {
                    type: "LICENSE",
                    string: string,
                };
            } else if (exceptions.indexOf(string) !== -1) {
                return {
                    type: "EXCEPTION",
                    string: string,
                };
            }
        } else return undefined;
        index = begin;
    }

    // Tries to read the next token. Returns `undefined` if no token is
    // recognized.
    function parseToken(): Token | undefined {
        // Ordering matters
        return operator() || documentRef() || licenseRef() || identifier();
    }

    const tokens = [];
    while (hasMore()) {
        skipWhitespace();
        if (!hasMore()) {
            break;
        }

        const token = parseToken();
        if (!token) {
            throw new Error(
                "Unexpected `" +
                    source[index] +
                    "` at offset " +
                    index +
                    " in expression `" +
                    source.slice(index, index + 20) +
                    "`",
            );
        }

        tokens.push(token);
    }
    return tokens;
};
