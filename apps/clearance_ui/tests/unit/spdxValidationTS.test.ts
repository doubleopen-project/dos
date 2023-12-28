// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

// SPDX-expression-parse unit tests
import parse from "spdx-expression-parse";

describe("SPDX expression parse tests", () => {
    it("Accepts a single valid license", () => {
        const licenses = ["MIT", "GPL-2.0-only", "Apache-2.0"];
        for (const license of licenses) {
            expect(parse(license)).toEqual({ license });
        }
    });

    it("Accepts a valid SPDX expression", () => {
        const expressions = [
            "MIT OR GPL-2.0-only",
            "(MIT AND GPL-2.0-only) OR Apache-2.0",
        ];
        expect(parse(expressions[0])).toEqual({
            left: { license: "MIT" },
            conjunction: "or",
            right: { license: "GPL-2.0-only" },
        });
        expect(parse(expressions[1])).toEqual({
            left: {
                left: { license: "MIT" },
                conjunction: "and",
                right: { license: "GPL-2.0-only" },
            },
            conjunction: "or",
            right: { license: "Apache-2.0" },
        });
    });

    it("Rejects an invalid license", () => {
        const licenses = ["BSD-2-Clause-FreeBSD", "GPL-2.0", "LGPL-2.0+"];
        for (const license of licenses) {
            expect(() => parse(license)).toThrow();
        }
    });

    it("Rejects an invalid SPDX expression", () => {
        const expressions = [
            "MIT OR",
            "MIT AND GPL-2.0-only OR",
            "(MIT AND GPL-2.0-only",
        ];
        for (const expression of expressions) {
            expect(() => parse(expression)).toThrow();
        }
    });
});
