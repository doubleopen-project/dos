// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { z } from "zod";

//------------------- Error schema -------------------

export const ErrorSchema = z.object({
  message: z.string(),
});
