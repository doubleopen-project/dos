// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

//------------------- POST logout --------------------

export const PostLogoutRes = z.object({
    message: z.string(),
});
