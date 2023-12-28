// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import parse from "spdx-expression-parse";

declare const getCurrentDateTime: () => string;

declare function parseSPDX(spdxString: string): parse.Info;

export { getCurrentDateTime, parseSPDX };
