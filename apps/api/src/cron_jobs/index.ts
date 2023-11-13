// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { rescanFilesWithTimeoutIssues } from "./timeout_issues";
import { jobStateQuery } from "./job_state_query";

export const cronJobs = {
    rescanFilesWithTimeoutIssues,
    jobStateQuery,
};
