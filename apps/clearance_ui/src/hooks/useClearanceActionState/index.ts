// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useUser } from "@/hooks/useUser";
import { hasPermission } from "@/helpers/hasPermission";

type ClearanceActionBlocker = "NO_PERMISSION" | null;

export const useClearanceActionState = () => {
    const user = useUser();

    let blocker: ClearanceActionBlocker = null;

    if (
        !user ||
        !user.permissions ||
        !hasPermission(user.permissions, "ClearanceItems", "POST")
    ) {
        blocker = "NO_PERMISSION";
    }

    return {
        canSubmit: blocker === null,
        blocker,
    };
};
