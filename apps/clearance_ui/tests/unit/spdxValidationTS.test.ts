// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

// SPDX-expression-parse unit tests
import { parseSPDX } from "common-helpers";
import { decomposeLicenses } from "@/helpers/decomposeLicenses";

describe("SPDX expression parse tests", () => {
    it("Accepts a single valid license", () => {
        const licenses = ["MIT", "GPL-2.0-only", "Apache-2.0"];
        for (const license of licenses) {
            expect(parseSPDX(license)).toEqual({ license });
        }
    });

    it("Accepts a valid SPDX expression", () => {
        const expressions = [
            "MIT OR GPL-2.0-only",
            "(MIT AND GPL-2.0-only) OR Apache-2.0",
        ];
        expect(parseSPDX(expressions[0])).toEqual({
            left: { license: "MIT" },
            conjunction: "or",
            right: { license: "GPL-2.0-only" },
        });
        expect(parseSPDX(expressions[1])).toEqual({
            left: {
                left: { license: "MIT" },
                conjunction: "and",
                right: { license: "GPL-2.0-only" },
            },
            conjunction: "or",
            right: { license: "Apache-2.0" },
        });
    });

    it("Accepts a valid SPDX expression with exception", () => {
        const expression =
            "MIT AND BSD-3-Clause WITH GCC-exception-3.1 OR CC-BY-4.0 AND Apache-2.0";
        expect(parseSPDX(expression)).toEqual({
            left: {
                left: {
                    license: "MIT",
                },
                conjunction: "and",
                right: {
                    license: "BSD-3-Clause",
                    exception: "GCC-exception-3.1",
                },
            },
            conjunction: "or",
            right: {
                left: {
                    license: "CC-BY-4.0",
                },
                conjunction: "and",
                right: {
                    license: "Apache-2.0",
                },
            },
        });
    });

    it("Rejects an invalid license", () => {
        const licenses = ["BSD-2-Clause-FreeBSD", "GPL-2.0", "LGPL-2.0+"];
        for (const license of licenses) {
            expect(() => parseSPDX(license)).toThrow();
        }
    });

    it("Rejects an invalid SPDX expression", () => {
        const expressions = [
            "MIT OR",
            "MIT AND GPL-2.0-only OR",
            "(MIT AND GPL-2.0-only",
        ];
        for (const expression of expressions) {
            expect(() => parseSPDX(expression)).toThrow();
        }
    });
});

describe("SPDX expression decomposition tests", () => {
    it("Extracts a unique and sorted list of licenses from multiple license expressions", () => {
        const expressions = [
            "MIT AND BSD-3-Clause WITH GCC-exception-3.1 OR CC-BY-4.0 AND Apache-2.0",
            "MIT OR GPL-2.0-only",
            "(MIT AND GPL-2.0-only) OR Apache-2.0",
        ];
        const expressionsSet = new Set(expressions);
        const result = decomposeLicenses(expressionsSet);
        expect(Array.from(result)).toEqual([
            "Apache-2.0",
            "BSD-3-Clause WITH GCC-exception-3.1",
            "CC-BY-4.0",
            "GPL-2.0-only",
            "MIT",
        ]);
    });
});
