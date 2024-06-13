// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Unit tests for searchForLicense helper function

import { searchForLicense } from "@/helpers/searchForLicense";

describe("searchForLicense tests", () => {
    it("Returns true for a license found in a compound expression", () => {
        const result = searchForLicense("MIT", "MIT AND GPL-2.0-only");
        expect(result).toBe(true);
    });

    it("Returns true for a license found in a compound expression with parentheses", () => {
        const result = searchForLicense(
            "MIT",
            "(MIT AND GPL-2.0-only) OR (BSD-3-Clause AND Apache-2.0)",
        );
        expect(result).toBe(true);
    });

    it("Returns true for a license found in a complicated compound expression with parentheses", () => {
        const result = searchForLicense(
            "LGPL-2.1-or-later",
            "((MPL-1.1 OR GPL-2.0-or-later OR LGPL-2.1-or-later) AND EUPL-1.1) AND (EUPL-1.1 AND EUPL-1.2) AND (MPL-1.1 OR GPL-2.0-or-later OR LGPL-2.1-or-later) AND (MPL-1.1 AND (MPL-1.1 OR GPL-2.0-only) AND EUPL-1.1) AND (MPL-1.1 OR GPL-1.0-or-later) AND (MPL-1.1 OR GPL-2.0-only) AND MIT",
        );
        expect(result).toBe(true);
    });

    it("Returns false for a license not found in a simple expression", () => {
        const result = searchForLicense("MIT", "GPL-2.0-only");
        expect(result).toBe(false);
    });

    it("Returns false for a license not found in a compound expression with parentheses", () => {
        const result = searchForLicense(
            "GPL-2.1-or-later",
            "(GPL-2.0-only AND BSD-3-Clause) OR (LGPL-2.1-or-later AND EPL-2.0)",
        );
        expect(result).toBe(false);
    });

    it("Returns false for a `substring` license name found in a complicated compound expression with parentheses", () => {
        const result = searchForLicense(
            "GPL-2.1-or-later",
            "((MPL-1.1 OR GPL-2.0-or-later OR LGPL-2.1-or-later) AND EUPL-1.1) AND (EUPL-1.1 AND EUPL-1.2) AND (MPL-1.1 OR GPL-2.0-or-later OR LGPL-2.1-or-later) AND (MPL-1.1 AND (MPL-1.1 OR GPL-2.0-only) AND EUPL-1.1) AND (MPL-1.1 OR GPL-1.0-or-later) AND (MPL-1.1 OR GPL-2.0-only) AND MIT",
        );
        expect(result).toBe(false);
    });

    it("Substring test 2", () => {
        const result = searchForLicense(
            "GPL-2.0-or-later",
            "LGPL-2.1-only AND LGPL-2.0-or-later AND LicenseRef-scancode-dco-1.1",
        );
        expect(result).toBe(false);
    });

    it("Substring test 3", () => {
        const result = searchForLicense("W3C", "Apache-2.0 AND W3C-19980720");
        expect(result).toBe(false);
    });
});
