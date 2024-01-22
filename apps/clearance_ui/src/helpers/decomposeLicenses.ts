// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { parseSPDX } from "common-helpers";
import parse from "spdx-expression-parse";

type SPDXExpression = {
    license?: string;
    exception?: string;
    conjunction?: "and" | "or";
    left?: SPDXExpression;
    right?: SPDXExpression;
};

function extractLicenses(expression: SPDXExpression | undefined): string[] {
    if (!expression) {
        return [];
    }
    const licenses: string[] = [];

    if (expression.license) {
        if (expression.exception) {
            licenses.push(`${expression.license} WITH ${expression.exception}`);
        } else {
            licenses.push(expression.license);
        }
    }
    if (expression.left) {
        const leftLicenses = extractLicenses(expression.left);
        licenses.push(...leftLicenses);
    }
    if (expression.right) {
        const rightLicenses = extractLicenses(expression.right);
        licenses.push(...rightLicenses);
    }

    return licenses;
}

export function decomposeLicenses(spdxExpressions: Set<string>): Set<string> {
    const allLicenses: string[] = [];

    // Process each SPDX expression and extract licenses
    spdxExpressions.forEach((spdxExpression) => {
        try {
            const parsedInfo = parseSPDX(spdxExpression);
            const licenses = extractLicenses(parsedInfo);
            allLicenses.push(...licenses);
        } catch (e) {
            allLicenses.push("INVALID SPDX EXPRESSION: " + e);
        }
    });

    // Deduplicate and sort the licenses alphabetically
    const uniqueLicenses = Array.from(new Set(allLicenses)).sort();

    return new Set(uniqueLicenses);
}
