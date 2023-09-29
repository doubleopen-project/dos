// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from 'zod';

export const GetUserRes = z.object({
    username: z.string(),
});