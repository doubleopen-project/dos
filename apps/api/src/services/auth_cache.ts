// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import NodeCache from "node-cache";

export const authCache = new NodeCache({
    stdTTL: 5 * 60,
    checkperiod: 60,
});
