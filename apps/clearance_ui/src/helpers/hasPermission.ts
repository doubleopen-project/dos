// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import type { Permissions } from "validation-helpers";

export const hasPermission = (
    permissions: Permissions,
    resource: string,
    scope: string,
) => {
    const permissionObj = permissions.find(
        (permission) => permission.rsname === resource,
    );

    if (!permissionObj) {
        return false;
    }

    return permissionObj.scopes.includes(scope);
};
