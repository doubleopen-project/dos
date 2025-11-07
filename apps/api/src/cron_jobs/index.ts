// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { cleanJobQueue } from "./clean_job_queue";
import { jobStateQuery } from "./job_state_query";

export const cronJobs = {
    jobStateQuery,
    cleanJobQueue,
};
