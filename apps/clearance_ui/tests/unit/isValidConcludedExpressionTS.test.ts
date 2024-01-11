// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Unit tests for isValidConcludedExpression helper function

import { isValidConcludedExpression } from "@/helpers/isValidConcludedExpression";

describe("isValidConcludedExpression tests", () => {
    it("Returns isValid: false and errWord: null for an empty string", () => {
        const result = isValidConcludedExpression("");
        expect(result).toEqual({
            isValid: false,
            errWord: null,
        });
    });
    it("Returns isValid: true and errWord: null for a valid license", () => {
        const result = isValidConcludedExpression("MIT");
        expect(result).toEqual({
            isValid: true,
            errWord: null,
        });
    });
    it("Returns isValid: false and errWord: 'GCC-exseption-2.0' for an invalid license", () => {
        const result = isValidConcludedExpression(
            "GPL-2.0-only with GCC-exseption-2.0",
        );
        expect(result).toEqual({
            isValid: false,
            errWord: "GCC-exseption-2.0",
        });
    });
});
