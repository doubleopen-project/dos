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

import { parseSPDX } from "../src";
import { ConjunctionInfo } from "../src/parse";

describe("Test parseSPDX: error throwing", () => {
    it("forbids tabs and newlines", () => {
        expect(() => parseSPDX("MIT\t")).toThrow();
        expect(() => parseSPDX("\nMIT")).toThrow();
    });

    it("forbids spaces between a license-id and a following `+`", () => {
        expect(() => parseSPDX("MIT +")).toThrow();
        expect(() => parseSPDX("MIT +")).toThrowErrorMatchingInlineSnapshot(
            `"Space before \`+\`"`,
        );
    });
});

describe("Test parseSPDX: valid expressions", () => {
    it("allows many spaces", () => {
        expect(parseSPDX(" MIT")).toEqual({ license: "MIT" });
        expect(parseSPDX("MIT ")).toEqual({ license: "MIT" });
        expect(parseSPDX("MIT  AND    BSD-3-Clause")).toEqual({
            left: { license: "MIT" },
            conjunction: "and",
            right: { license: "BSD-3-Clause" },
        });
    });
    it("parses DocumentRefs and LicenseRefs", () => {
        expect(parseSPDX("LicenseRef-something")).toEqual({
            license: "LicenseRef-something",
        });

        expect(
            parseSPDX("DocumentRef-spdx-tool-1.2 : LicenseRef-MIT-Style-2"),
        ).toEqual({
            license: "DocumentRef-spdx-tool-1.2:LicenseRef-MIT-Style-2",
        });
    });
    it("parses `AND`, `OR` and `WITH` with the correct precedence", () => {
        expect(parseSPDX("MIT AND BSD-3-Clause AND CC-BY-4.0")).toEqual({
            left: { license: "MIT" },
            conjunction: "and",
            right: {
                left: { license: "BSD-3-Clause" },
                conjunction: "and",
                right: { license: "CC-BY-4.0" },
            },
        });

        expect(
            parseSPDX(
                "MIT AND BSD-3-Clause WITH GCC-exception-3.1 OR CC-BY-4.0 AND Apache-2.0",
            ),
        ).toEqual({
            left: {
                left: { license: "MIT" },
                conjunction: "and",
                right: {
                    license: "BSD-3-Clause",
                    exception: "GCC-exception-3.1",
                },
            },
            conjunction: "or",
            right: {
                left: { license: "CC-BY-4.0" },
                conjunction: "and",
                right: { license: "Apache-2.0" },
            },
        });
    });
    it("allows mixed-case `and`, `or`, and `with`", () => {
        const variants = [
            "MIT and BSD-3-Clause or GPL-2.0-only with GCC-exception-2.0",
            "MIT aNd BSD-3-Clause oR GPL-2.0-only wITh GCC-exception-2.0",
            "MIT AnD BSD-3-Clause Or GPL-2.0-only WitH GCC-exception-2.0",
        ];
        const result: ConjunctionInfo = {
            left: {
                left: { license: "MIT" },
                conjunction: "and",
                right: { license: "BSD-3-Clause" },
            },
            conjunction: "or",
            right: {
                license: "GPL-2.0-only",
                exception: "GCC-exception-2.0",
            },
        };

        for (let index = 0; index < variants.length; index++) {
            const variant = variants[index];
            expect(parseSPDX(variant)).toEqual(result);
        }
    });
});
