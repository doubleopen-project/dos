// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

// SPDX-expression-parse unit tests
import { decomposeLicenses } from "@/helpers/decomposeLicenses";

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
