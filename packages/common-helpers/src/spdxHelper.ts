// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

// This masks the implementation details of the chosen SPDX expression parser
import parse from "spdx-expression-parse";

export function parseSPDX(spdxString: string): parse.Info {
    return parse(spdxString);
}
