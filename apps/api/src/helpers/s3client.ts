// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { S3Client } from "s3-helpers";

export const s3Client = S3Client(
    process.env.NODE_ENV !== "production",
    process.env.SPACES_ENDPOINT,
    process.env.SPACES_KEY,
    process.env.SPACES_SECRET,
);
