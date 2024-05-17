// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { makeApi } from "@zodios/core";
import { errors } from "../errors";
import * as schemas from "../schemas/auth_schemas";

export const authAPI = makeApi([
    {
        method: "post",
        path: "/logout",
        description: "Logout",
        alias: "PostLogout",
        response: schemas.PostLogoutRes,
        errors,
    },
]);
